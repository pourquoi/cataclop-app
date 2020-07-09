<template>
    <GridLayout rows="auto, auto, *" v-if="horse">
        <FlexboxLayout row="0" v-show="showPlayers" class="session" v-if="race">
            <Label
                :text="race.session.hippodrome.name + ' - ' + 'R' + race.session.num + 'C' + race.num"
            />
        </FlexboxLayout>

        <GridLayout row="1" v-show="showPlayers" class="players">
            <RadListView
                ref="playerList"
                v-if="race && race.player_set"
                orientation="horizontal"
                for="player in race.player_set"
                @itemTap="onPlayerTap"
            >
                <v-template>
                    <GridLayout
                        class="players__item"
                        :class="{'players__item--active': player._selected}"
                        :key="'horse-player-' + player.id"
                    >
                        <FlexboxLayout orientation="horizontal" alignItems="center">
                            <Label
                                v-if="player.position"
                                :text="player.position"
                                class="pos"
                                verticalAlignment="center"
                            />
                            <Label
                                :textWrap="false"
                                :text="'#' + player.num + ' ' + player.horse.name"
                                class="name"
                                verticalAlignment="center"
                            />
                        </FlexboxLayout>
                    </GridLayout>
                </v-template>
            </RadListView>
        </GridLayout>

        <ScrollView row="2">
            <GridLayout rows="auto, *">
                <StackLayout row="0" class="header">
                    <FlexboxLayout
                        row="0"
                        col="0"
                        orientation="horizontal"
                        class="breed"
                        horizontalAlignment="center"
                        alignItems="center"
                        justifyContent="center"
                    >
                        <Image src.decode="font://&#xf6f0;" class="fas" />
                        <Label :text="horse.sex + ' - ' + horse.breed"></Label>
                    </FlexboxLayout>

                    <Label :text="horse.stats.music" class="music"></Label>

                    <GridLayout rows="auto" columns="2*, *" class="header__infos">
                        <GridLayout columns="auto, *" rows="auto, auto, auto, auto, auto">
                            <Label row="1" col="0" text="# Courses" class="info__label"></Label>
                            <Label row="1" col="1" :text="horse.stats.race_count"></Label>

                            <Label row="2" col="0" text="# Victoires" class="info__label"></Label>
                            <Label row="2" col="1" :text="horse.stats.victory_count"></Label>

                            <Label row="3" col="0" text="# Placés" class="info__label"></Label>
                            <Label row="3" col="1" :text="horse.stats.placed_count"></Label>

                            <Label row="4" col="0" text="Gains" class="info__label"></Label>
                            <Label row="4" col="1" :text="horse.stats.earnings | price(0)"></Label>
                        </GridLayout>

                        <GridLayout
                            col="1"
                            columns="auto, *"
                            rows="auto, auto, auto"
                            class="trueskill"
                            @tap="showLegend"
                        >
                            <Label row="0" text="TrueSkill" />
                            <Image row="0" col="1" src.decode="font://&#xf05a;" class="fas" />

                            <Label row="1" col="0" text="mu" class="info__label"></Label>
                            <Label
                                row="1"
                                col="1"
                                :text="horse.stats.trueskill_mu"
                                class="trueskill__mu"
                            ></Label>

                            <Label row="2" col="0" text="sigma" class="info__label"></Label>
                            <Label
                                row="2"
                                col="1"
                                :text="horse.stats.trueskill_sigma"
                                class="trueskill__sigma"
                            ></Label>
                        </GridLayout>
                    </GridLayout>
                </StackLayout>

                <StackLayout class="races" row="1">
                    <StackLayout class="races__item races__item--tomorrow" v-if="tomorrowRace">
                        <Label text="Demain" class="races__title" />
                        <GridLayout
                            columns="100, *, *"
                            rows="20, 20, 20"
                            @tap="onRaceTap(tomorrowRace)"
                        >
                            <Label
                                row="0"
                                col="0"
                                :text="'R' + tomorrowRace.session.num + 'C' + tomorrowRace.num"
                                class="item__info--title item__info"
                            ></Label>
                            <Label
                                class="item__info item__info--location"
                                row="2"
                                col="0"
                                :text="tomorrowRace.session.hippodrome.name"
                            ></Label>

                            <Label
                                row="0"
                                col="1"
                                class="item__info item__info--date"
                                :text="tomorrowRace.start_at | datetime"
                            ></Label>
                            <Label
                                class="item__info"
                                row="1"
                                col="1"
                                :text="tomorrowRace.declared_player_count + ' partants'"
                            ></Label>
                            <Label
                                class="item__info"
                                row="2"
                                col="1"
                                :text="tomorrowRace.prize | price"
                            ></Label>

                            <Label
                                class="item__info"
                                row="0"
                                col="2"
                                :text="tomorrowRace._odds | odds('rapport: ')"
                            />
                            <Label
                                class="item__info item__info--position"
                                row="1"
                                col="2"
                                rowSpan="2"
                                :text="tomorrowRace._position | position"
                            />
                        </GridLayout>
                    </StackLayout>

                    <StackLayout class="races__item races__item--today" v-if="todayRace">
                        <Label text="Ajourd'hui" class="races__title" />
                        <GridLayout
                            columns="100, *, *"
                            rows="20, 20, 20"
                            @tap="onRaceTap(todayRace)"
                        >
                            <Label
                                row="0"
                                col="0"
                                :text="'R' + todayRace.session.num + 'C' + todayRace.num"
                                class="item__info--title item__info"
                            ></Label>
                            <Label
                                class="item__info item__info--location"
                                row="2"
                                col="0"
                                :text="todayRace.session.hippodrome.name"
                            ></Label>

                            <Label
                                row="0"
                                col="1"
                                class="item__info item__info--date"
                                :text="todayRace.start_at | datetime"
                            ></Label>
                            <Label
                                class="item__info"
                                row="1"
                                col="1"
                                :text="todayRace.declared_player_count + ' partants'"
                            ></Label>
                            <Label
                                class="item__info"
                                row="2"
                                col="1"
                                :text="todayRace.prize | price"
                            ></Label>

                            <Label
                                class="item__info"
                                row="0"
                                col="2"
                                :text="todayRace._odds | odds('rapport: ')"
                            />
                            <Label
                                class="item__info item__info--position"
                                row="1"
                                col="2"
                                rowSpan="2"
                                :text="todayRace._position | position"
                            />
                        </GridLayout>
                    </StackLayout>

                    <Label text="Historique" class="races__title m-l-10" />

                    <StackLayout class="races__item" v-for="r in pastRaces" :key="r.id">
                        <GridLayout columns="100, *, *" rows="20, 20, 20" @tap="onRaceTap(r)">
                            <Label
                                row="0"
                                col="0"
                                :text="'R' + r.session.num + 'C' + r.num"
                                class="item__info--title item__info"
                            ></Label>
                            <Label
                                class="item__info item__info--location"
                                row="2"
                                col="0"
                                :text="r.session.hippodrome.name"
                            ></Label>

                            <Label
                                row="0"
                                col="1"
                                class="item__info item__info--date"
                                :text="r.start_at | datetime"
                            ></Label>
                            <Label
                                class="item__info"
                                row="1"
                                col="1"
                                :text="r.declared_player_count + ' partants'"
                            ></Label>
                            <Label class="item__info" row="2" col="1" :text="r.prize | price"></Label>

                            <Label
                                class="item__info"
                                row="0"
                                col="2"
                                :text="r._odds | odds('rapport: ')"
                            />
                            <Label
                                class="item__info item__info--position"
                                row="1"
                                col="2"
                                rowSpan="2"
                                :text="r._position | position"
                            />
                        </GridLayout>
                    </StackLayout>
                </StackLayout>
            </GridLayout>
        </ScrollView>
    </GridLayout>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import moment from "moment";

import { ListViewItemSnapMode } from "nativescript-ui-listview";

import RaceDetails from "./RaceDetails";
import HorseList from "./HorseList";
import RaceLegend from "../Modals/RaceLegend";

export default {
    props: ["context"],
    data() {
        return {
            mode: undefined
        }
    },
    computed: {
        title() {
            return this.horse ? this.horse.name : "...";
        },
        showPlayers() {
            if (this.race && this.horse) {
                let player = this.race.player_set.find(
                    p => p.horse.id == this.horse.id
                );
                return !!player;
            }
            return false;
        },
        pastRaces() {
            if (!this.horse) return [];
            let now = moment().format("YYYYMMDD");
            return this.horse.races.results.filter(
                r => moment(r.start_at).format("YYYYMMDD") < now
            );
        },
        todayRace() {
            if (!this.horse) return null;
            let now = moment().format("YYYYMMDD");
            let races = this.horse.races.results.filter(
                r => moment(r.start_at).format("YYYYMMDD") == now
            );
            return races.length > 0 ? races[0] : null;
        },
        tomorrowRace() {
            if (!this.horse) return null;
            let now = moment().format("YYYYMMDD");
            let races = this.horse.races.results.filter(
                r => moment(r.start_at).format("YYYYMMDD") > now
            );
            return races.length > 0 ? races[0] : null;
        },
        horse() {
            if (this.mode == "stats") {
                return this.$store.state.stats_horse;
            }
            return this.$store.state.horse;
        },
        ...mapState(["race", "processing"])
    },
    methods: {
        ...mapMutations(["updateUI"]),
        load({ horse, mode }) {
            this.mode = mode;
            if(horse && horse.id) {
                this.updateUI({title: horse.name})
                this.$emit('start-loading')
                setTimeout( () => {
                    this.$store.dispatch("loadHorse", {id: horse.id, is_stats: mode == "stats"}).then(h => {
                        this.$emit('end-loading')
                        setTimeout(() => this.scrollPlayerList(), 250);
                    })
                    .catch(err => {
                        this.$emit('end-loading')
                    });
                })
            } else if (this.horse) {
                this.updateUI({title: this.horse.name})
                this.$emit('end-loading')
            }
        },
        scrollToTop() {},
        scrollPlayerList() {
            let i,
                idx = 0;
            if (!this.showPlayers) return;
            for (i = 0; i < this.race.player_set.length; i++) {
                if (this.race.player_set[i]._selected) {
                    idx = i;
                    break;
                }
            }
            if (this.$refs.playerList)
                this.$refs.playerList.$el.nativeView.scrollToIndex(
                    idx,
                    true,
                    ListViewItemSnapMode.Center
                );
        },
        onNavigated(args) {
            
        },
        onPlayerTap(args) {
            let player = args.item;

            this.$emit("change-view", {
                view: "horse",
                props: {
                    horse: player.horse,
                    mode: "stats"
                }
            })

            this.$store.dispatch("loadHorse", player.horse.id);
        },
        onRaceTap(race) {
            this.$emit("change-view", {
                view: "horserace",
                props: {
                    race: race,
                    mode: "stats"
                }
            })
        },
        onBack() {
            this.$navigateBack();
        },
        showLegend() {
            this.$emit("change-view", {
                view: "__modal__",
                props: {}
            })

            this.$showModal(RaceLegend).then(() => {
                this.$emit("change-view", {
                    view: "__modal__",
                    props: {close: true}
                })
            });
        }
    }
};
</script>

<style scoped lang="scss">
@import "~/styles/variables";
@import "~/styles/transitions";

@keyframes horse {
    0% {
        transform: translate(0, 0) rotate(0deg);
    }
    50% {
        transform: translate(0, -2) rotate(-5deg);
    }
    75% {
        transform: translate(0, -3) rotate(-10deg);
    }
    75% {
        transform: translate(0, 1) rotate(5deg);
    }
}

ActionBar {
    background-color: $purple;
    color: #fff;
}

.session {
    height: 40;
    background-color: $purple;
    color: #fff;
    align-items: center;
    justify-content: center;
}

.players {
    background-color: #ffdef1;
    color: #fff;
    height: 40;
    border-bottom-width: 3;
    border-color: $purple;

    RadListView {
        height: 40;
    }

    &__item {
        height: 40;
        width: 150;
        text-align: center;
        margin-left: 0;
        background-color: transparent;
        color: $purple;
        border-left-width: 1;
        border-color: #fff;

        &--active {
            background-color: $purple;
            color: #fff;
        }

        .pos {
            color: red;
            font-size: 20;
        }

        .name {
            width: 100;
        }
    }
}

.header {
    font-size: 12;
    margin: 0;
    padding: 10;

    .breed {
        font-size: 15;
        text-align: center;

        image {
            animation-name: horse;
            animation-iteration-count: infinite;
            animation-duration: 1s;
            color: brown;
        }
    }

    .fas {
        height: 20;
        margin-right: 5;
    }

    .music {
        font-size: 20;
        color: $purple;
        text-align: center;
        margin-bottom: 10;
    }

    .trueskill {
        &__mu {
            color: $orange;
        }

        image {
            height: 20;
            width: 20;
            color: $yellow;
        }
    }

    &__infos {
        font-size: 12;
        background-color: #f8f8f8;
        border-color: #c6c6c6;
        border-width: 1;
        padding: 10;

        .info__label {
            margin-right: 20;
        }
    }
}

.races {
    background-color: transparent;

    &__title {
        color: #333;
        text-decoration: underline;
    }

    &__item {
        background-color: #f8f8f8;
        color: $purple;
        border-bottom-width: 3;
        border-color: #c6c6c6;
        padding: 10;
        margin-bottom: 10;
        text-align: left;
        font-size: 10;

        &--today {
            background-color: transparent;
            border-color: $yellow;
        }

        &--tomorrow {
            background-color: transparent;
            border-color: $yellow;
        }

        .item__title {
            font-size: 20;
            text-align: left;
            margin-right: 20;
        }

        .item__location {
            text-align: left;
            margin-right: 20;
        }

        .item__date {
            font-size: 18;
            text-align: left;
        }

        .item__info {
            font-size: 10;
            padding: 0;
            color: #333;

            &--title {
                font-size: 15;
            }

            &--date {
                color: $purple;
                font-size: 15;
            }

            &--location {
            }

            &--position {
                color: $red;
                font-size: 20;
            }
        }

        .winner-icon {
            height: 10;
            width: 10;
        }
    }
}
</style>