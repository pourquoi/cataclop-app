import Vue from "nativescript-vue";
import Vuex from "vuex";

Vue.use(Vuex)

import moment from 'moment';

import { client, interceptors } from "@/api/client"

import { sortPlayers, parseRace, parsePlayer } from "./utils"

function updateClientInterceptor(user) {
    if ("auth" in interceptors) {
        client.interceptors.request.eject(interceptors["auth"])
        delete interceptors["auth"]
    }

    let interceptor = (config) => {
        config.headers["Authorization"] = "Bearer " + user.token
        return config;
    }

    interceptors["auth"] = client.interceptors.request.use(interceptor)
}

export default new Vuex.Store({
    state: {
        frame: 'races',
        user: null,
        race: null,
        stats_race: null,
        session: null,
        horses: {
            results: []
        },
        horse: null,
        processing: {
            sessions: false,
            race: false,
            horses: false,
            horse: false
        },
        sessions: {
            results: []
        },
        context: {
            day: moment(),
        }
    },
    mutations: {
        login(state, user) {
            state.user = Object.assign({}, user);
            updateClientInterceptor(user)
        },
        logout(state) {
            state.user = null;
        },
        setFrame(state, frame) {
            state.frame = frame;
        },
        setStatsRace(state, race) {
            console.log('setStatsRace', race.id)
            race.player_set.sort(sortPlayers)
            race._current = state.race && state.race.id == race.id
            
            race.player_set = race.player_set.map(p => {
                p._selected = false
                p._current = !race._current && state.horse && state.horse.id == p.horse.id
                p._sibling = !race._current && !p._current && state.race && !!state.race.player_set.find(pp => pp.horse.id == p.horse.id)
                return p;
            })

            state.stats_race = race
        },
        setRace(state, race) {
            if( race ) {
                console.log('setRace', race.id)
                race.player_set.sort(sortPlayers)
                race._selected = true
                
                race.player_set = race.player_set.map(p => {
                    p._selected = false
                    p._current = false
                    p._sibling = false
                    return p;
                })
            }
            state.race = race

            if(state.session) {
                state.session.race_set.forEach( r => {
                    r._selected = race && r.id == race.id
                    return r;
                })
            }
        },
        setSession(state, session) {
            session._selected = true
            state.session = session

            state.sessions.results.forEach((s) => {
                s._selected = session && s.id == session.id;
            })
        },
        setSessions(state, sessions) {
            sessions.results = sessions.results.map(s => {
                s.race_set = s.race_set.map(parseRace)
                return { ...s, _selected: false }
            })
            state.sessions = Object.assign({}, sessions)
            if( sessions.results.length ) {
                state.session = sessions.results[0];
                state.session._selected = true;
            } else {
                state.session = null;
            }
        },
        setProcessing(state, processing) {
            state.processing = Object.assign({}, state.processing, processing)
        },
        setContext(state, context) {
            state.context = Object.assign({}, state.context, context)
        },
        setHorse(state, horse) {
            horse = { ...{ stats: null, races: { results: [] } }, ...horse }

            if(state.race) {
                console.log('setHorse', horse.id)
                
                state.race.player_set = state.race.player_set.map(p => {
                    p._selected = p.horse && horse &&  p.horse.id == horse.id
                    return p
                })

                console.log('player_set', state.race.player_set.map(p => [p.horse.id, p._selected]))
            }

            horse.races.results = horse.races.results.map(race => {
                race = parseRace(race)
                race = { ...race, ...{ _position: null, _odds: null } }
                let has_results = false, i, player;

                race.player_set = race.player_set.map(parsePlayer)

                // add some shortcut for this horse's data in this race
                for(i=0; i<race.player_set.length; i++) {
                    player = race.player_set[i];
                    if(player.position) {
                        has_results = true;
                    }
                    if(player.horse.id == horse.id) {
                        race._position = player.position
                        race._odds = player.final_odds    
                    }
                }

                race.player_set.sort(sortPlayers)
                
                return race
            })

            if (horse.races.results.length > 0) {
                let race = horse.races.results[0]
                let player = race.player_set.find(p => (p.horse.id == horse.id))
                if (player) {
                    horse.stats = player
                }
            }

            state.horse = horse
        },
        setHorses(state, horses) {
            state.horses = Object.assign({}, horses)
        },
        clearHorses(state) {
            state.horses = {
                results: []
            }
        }
    },
    actions: {
        login({ commit }, credentials) {
            return client.post('/token/refresh', credentials)
                .then(r => {
                    let user = {
                        email: credentials.email,
                        token: r.data.token
                    }
                    commit('login', user)
                    return user
                })
        },
        loadRaces({ commit }, filters) {
            return client.get('/races/')
                .then(r => {
                    let races = r.data;
                    commit('setRaces', races);
                    return races;
                })
        },
        loadRace({ commit }, {id, is_stats}) {
            commit('setProcessing', { race: true });
            return client.get(`/races/${id}`)
                .then(r => {
                    let race = r.data;
                    if(is_stats)
                        commit('setStatsRace', race);
                    else
                        commit('setRace', race);
                    commit('setProcessing', { race: false });
                    return race;
                })
                .catch(err => {
                    commit('setProcessing', { race: false });
                    throw err
                })
        },
        loadSessions({ state, commit }) {
            let filters = {
                date: state.context.day.format('YYYY-MM-DD')
            }

            commit('setProcessing', { sessions: true });

            return client.get('/sessions/', { params: filters })
                .then(r => {
                    let sessions = r.data;
                    commit('setSessions', sessions);
                    commit('setProcessing', { sessions: false });
                    return sessions;
                })
                .catch(err => {
                    console.log(err)
                    commit('setProcessing', { sessions: false });
                    throw err
                })
        },
        loadHorses({ state, commit }, q) {
            commit('setProcessing', { horses: true });

            let filters = { q: q }

            return client.get('/horses/', { params: filters })
                .then(r => {
                    let horses = r.data;
                    commit('setHorses', horses);
                    commit('setProcessing', { horses: false });
                    return horses;
                })
                .catch(err => {
                    console.log(err)
                    commit('setProcessing', { horses: false });
                    throw err
                })
        },
        loadHorse({ commit }, id) {
            commit('setProcessing', { horse: true });

            return client.get(`/horses/${id}`)
                .then(r => {
                    let horse = r.data;

                    return client.get('/races', { params: { horse: horse.id } })
                        .then(r => {
                            horse.races = r.data
                            commit('setHorse', horse);
                            commit('setProcessing', { horse: false });
                            return horse;
                        })
                        .catch(err => {
                            console.log(err)
                            commit('setProcessing', { horse: false });
                            throw err
                        })
                })
                .catch(err => {
                    console.log(err)
                    commit('setProcessing', { horse: false });
                    throw err
                })
        }
    }
})