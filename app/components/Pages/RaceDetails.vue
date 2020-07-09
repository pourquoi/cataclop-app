<template>
    <GridLayout rows="auto, *" height="100%">
        <GridLayout row="0" v-show="showRaces" class="races">
            <RadListView
                ref="raceList"
                v-if="session"
                orientation="horizontal"
                for="r in session.race_set"
                @itemTap="onSessionRaceTap"
            >
                <v-template>
                    <GridLayout class="races__item" :class="{'races__item--active': r._selected}">
                        <Label :text="'R' + session.num + 'C' + r.num" class="num" />
                    </GridLayout>
                </v-template>
            </RadListView>
        </GridLayout>

        <ScrollView row="1">
            <GridLayout rows="auto, *" v-if="race">
                <StackLayout row="0" class="header">
                    <Label class="date" :text="race.start_at | datetime('ddd D MMMM HH[h]mm')"></Label>
                    <Label
                        class="name"
                        :text="race.session.hippodrome.name + ' (' + race.session.hippodrome.country + ')'"
                    ></Label>

                    <GridLayout
                        columns="auto, *"
                        rows="auto, auto, auto, auto, auto"
                        class="header__infos"
                    >
                        <Label class="info__label" col="0" row="0" text="Catégorie" />
                        <Label
                            col="1"
                            row="0"
                            class
                            :text="race.category + ' - ' + race.sub_category"
                        ></Label>

                        <Label class="info__label" col="0" row="1" text="Distance" />
                        <Label col="1" row="1" class :text="race.distance | distance"></Label>

                        <Label class="info__label" col="0" row="2" text="Prix" />
                        <Label col="1" row="2" class :text="race.prize | price(0)"></Label>

                        <Label class="info__label" col="0" row="3" text="Condition Sexe" />
                        <Label col="1" row="3" class :text="race.condition_sex"></Label>

                        <Label class="info__label" col="0" row="4" text="Condition Age" />
                        <Label col="1" row="4" class :text="race.condition_age"></Label>
                    </GridLayout>
                </StackLayout>

                <GridLayout row="1" rows="auto, *" class="players">
                    <GridLayout
                        columns="30, *, 100, 50, 50, 50"
                        rows="auto, auto, auto"
                        class="players__filter"
                        @tap="showLegend"
                    >
                        <Label row="0" col="0" rowSpan="2" text="Pos."></Label>

                        <Label row="0" col="1" rowSpan="2" text="Cheval"></Label>
                        <Label row="0" col="2" rowSpan="2" text="Musique" class="text-center"></Label>

                        <Label row="0" col="3" text="Rapport"></Label>
                        <Label row="1" col="3" text="Rapport Réf."></Label>
                        <Image row="2" col="3" src.decode="font://&#xf05a;" class="fas" />

                        <Label row="0" col="4" text="TrueSkill mu"></Label>
                        <Label row="1" col="4" text="TrueSkill sigma"></Label>
                        <Image row="2" col="4" src.decode="font://&#xf05a;" class="fas" />

                        <Label row="0" col="5" text="Prédiction"></Label>
                        <Image row="2" col="5" src.decode="font://&#xf05a;" class="fas" />
                    </GridLayout>

                    <StackLayout row="1">
                        <GridLayout
                            v-for="player in race.player_set"
                            @tap="onPlayerTap(player)"
                            :key="player.id"
                            columns="30, *, 100, 50, 50, 50"
                            rows="auto, auto"
                            class="players__item"
                            :class="{current: player._current, sibling: player._sibling}"
                        >
                            <Label
                                class="pos"
                                row="0"
                                col="0"
                                rowSpan="2"
                                :text="player.position | position"
                            ></Label>

                            <Label
                                class="horse"
                                row="0"
                                col="1"
                                rowSpan="2"
                                :text="'#' + player.num + ' ' + player.horse.name"
                            ></Label>
                            <Label class="music" row="0" col="2" rowSpan="2" :text="player.music"></Label>

                            <Label
                                class="odds text-center"
                                row="0"
                                col="3"
                                :text="player.final_odds | odds"
                            ></Label>
                            <Label
                                class="text-center"
                                row="1"
                                col="3"
                                :text="player.final_odds_ref | odds"
                            ></Label>

                            <Label class="trueskill" row="0" col="4" :text="player.trueskill_mu"></Label>
                            <Label row="1" col="4" :text="player.trueskill_sigma"></Label>

                            <Label
                                class="prediction"
                                row="0"
                                col="5"
                                :text="player.position_prediction"
                            ></Label>
                        </GridLayout>
                    </StackLayout>
                </GridLayout>
            </GridLayout>
        </ScrollView>
    </GridLayout>
</template>

<script>
import { mapState, mapMutations } from "vuex";

import moment from "moment";
moment.locale("fr");

import { ListViewItemSnapMode } from "nativescript-ui-listview";

import HorseDetails from "./HorseDetails";
import RaceLegend from "../Modals/RaceLegend";

export default {
    props: ["context", "frame"],

    data() {
        return {
            mode: undefined
        };
    },

    computed: {
        title() {
            return this.race
                ? "R" + this.race.session.num + "C" + this.race.num
                : "...";
        },
        showRaces() {
            return false;
            if (!this.frame == "stats") return false;

            if (this.session) {
                if (this.session.race_set.find(r => r.id == this.race.id)) {
                    return true;
                }
            }
            return false;
        },
        race() {
            if (this.mode == "stats") {
                return this.$store.state.stats_race;
            }
            return this.$store.state.race;
        },
        ...mapState(["session", "processing"])
    },

    methods: {
        ...mapMutations(["updateUI"]),
        load({ race, mode }) {
            this.mode = mode
            if (race && race.id) {
                this.$emit('start-loading')
                setTimeout( () => {
                    this.$store
                        .dispatch("loadRace", {
                            id: race.id,
                            is_stats: mode == "stats"
                        })
                        .then(r => {
                            this.updateUI({title: 'R' + r.session.num + 'C' + r.num})
                            this.$emit('end-loading')
                            setTimeout(() => this.scrollRaceList(), 250);
                        })
                        .catch(err => {
                            this.$emit('end-loading')
                        });
                }, 250)
            } else if (this.race) {
                this.updateUI({title: 'R' + this.race.session.num + 'C' + this.race.num})
                this.$emit('end-loading')
            }
        },
        scrollRaceList() {
            let i,
                idx = 0;
            if (!this.showRaces) return;
            for (i = 0; i < this.session.race_set.length; i++) {
                if (this.session.race_set[i]._selected) {
                    idx = i;
                    break;
                }
            }
            if (this.$refs.raceList)
                this.$refs.raceList.$el.nativeView.scrollToIndex(
                    idx,
                    true,
                    ListViewItemSnapMode.Center
                );
        },
        onLoaded() {},
        onNavigating(args) {},
        onSessionRaceTap(args) {
            let race = args.item;
            this.$store.dispatch("loadRace", { id: race.id });
        },
        onPlayerTap(player) {
            this.$emit("change-view", {
                view: "horse",
                props: {
                    horse: player.horse,
                    mode: this.mode
                }
            });
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

ActionBar {
    background-color: $purple;
    color: #fff;
}

.races {
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
        width: 80;
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
    }
}

.header {
    font-size: 12;
    margin: 0;
    padding: 10;

    .name {
        font-size: 15;
        text-align: center;
    }

    .date {
        font-size: 20;
        color: $purple;
        text-align: center;
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

.players {
    padding: 10;
    font-size: 10;

    &__filter {
        color: #333;
        background-color: #f8f8f8;
        padding-bottom: 5;

        label {
            text-align: center;
        }

        image {
            height: 20;
            width: 20;
            color: $yellow;
        }
    }

    &__item {
        background-color: transparent;
        border-bottom-width: 1;
        border-color: #c6c6c6;
        color: #333;
        padding-top: 5;
        padding-bottom: 5;

        .pos {
            color: $red;
        }
        .horse {
            color: $purple;
        }
        .prediction {
            color: $orange;
        }
        .trueskill {
            color: $orange;
        }

        &.current {
            border-left-width: 3;
            border-left-color: $yellow;
            padding-left: 1;
        }

        &.sibling {
            border-left-color: $blue;
            border-left-width: 3;
            padding-left: 1;
        }
    }
}
</style>