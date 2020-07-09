<template>
    <GridLayout rows="auto, *">
        <FlexboxLayout
            row="0"
            horizontalAlignment="center"
            orientation="horizontal"
            class="filters"
            :class="{enabled: !processing.sessions}"
        >
            <StackLayout class="filters__item filters__item--nav">
                <Image src.decode="font://&#xf053;" class="fas" @tap="onPrevDay" />
            </StackLayout>
            <StackLayout
                class="filters__item filters__item--date"
                orientation="horizontal"
                @tap="onTapDate"
            >
                <Image
                    src.decode="font://&#xf274;"
                    class="fas"
                    verticalAlignment="center"
                    horizontalAlignment="center"
                />
                <Label
                    verticalAlignment="center"
                    horizontalAlignment="right"
                    :isEnabled="!processing.sessions"
                    :text="context.day | date"
                />
            </StackLayout>
            <StackLayout class="filters__item filters__item--nav">
                <Image src.decode="font://&#xf054;" class="fas" @tap="onNextDay" />
            </StackLayout>
        </FlexboxLayout>

        <GridLayout row="1" rows="90, *">
            <GridLayout row="0" class="sessions">

                <ScrollView orientation="horizontal">

                        <StackLayout orientation="horizontal">
                            <StackLayout v-for="s in sessions.results" @tap="onSessionTap(s)" :key="s.id"
                                class="sessions__item"
                                :class="{'sessions__item--active': s._selected}"
                            >
                                <Label :text="'R' + s.num" class="num" />
                                <Label :text="s.hippodrome.name" class="name" />
                                <Label :text="'(' + s.hippodrome.country + ')'" class="country" />
                            </StackLayout>
                        </StackLayout>
                    
                </ScrollView>

                <StackLayout v-if="sessions.results.length == 0" class="empty" verticalAlignment="center" horizontalAlignment="center">
                    <Label text="Aucune réunion trouvée pour cette date." />
                </StackLayout>
            </GridLayout>

            <!--
                    <ListPicker :items="sessionsList" @selectedIndexChange="onSelectSession" />
            -->

            <GridLayout row="1" class="session-details">
                <StackLayout v-if="session">
                    <RadListView class="races" for="r in session.race_set" @itemTap="onRaceTap">
                        <v-template>
                            <StackLayout class="races__item">
                                <GridLayout columns="auto, *, *" rows="20, 20, 20">
                                    <Label
                                        rowSpan="3"
                                        row="0"
                                        col="0"
                                        :text="'R' + session.num + 'C' + r.num"
                                        class="item__title"
                                    ></Label>
                                    <Label
                                        class="item__info"
                                        row="0"
                                        col="1"
                                        :text="r.sub_category"
                                    ></Label>
                                    <Label
                                        class="item__info"
                                        row="1"
                                        col="1"
                                        :text="r.declared_player_count + ' partants'"
                                    ></Label>
                                    <Label
                                        class="item__info"
                                        row="2"
                                        col="1"
                                        :text="r.prize | price(0)"
                                    ></Label>
                                    <Label
                                        rowSpan="3"
                                        row="0"
                                        col="2"
                                        :text="r.start_at | time"
                                        class="item__date"
                                    ></Label>
                                </GridLayout>
                            </StackLayout>
                        </v-template>
                    </RadListView>
                </StackLayout>

                <StackLayout class="empty" v-if="!session" horizontalAlignment="center" verticalAlignment="center">
                    <StackLayout>
                        <Image src.decode="font://&#xf127;" class="fas" />
                        <Label text="Aucune course trouvée." />
                        <Label :textWrap="true" text="Les courses à venir sont disponibles uniquement pour le jour même et le lendemain." />
                    </StackLayout>
                </StackLayout>
            </GridLayout>
        </GridLayout>
    </GridLayout>
</template>

<script>
import { mapState, mapMutations } from "vuex";

import moment from "moment";
moment.locale("fr");

import { ListViewItemSnapMode } from "nativescript-ui-listview";

import RaceDetails from "./RaceDetails";
import SessionSearch from "../Modals/SessionSearch";

export default {
    components: {
        SessionSearch,
        RaceDetails
    },
    data: () => {
        return {
            
        };
    },
    computed: {
        sessionsList() {
            return this.sessions.results.map(
                s => "R" + s.num + " " + s.hippodrome.name
            );
        },
        results() {
            return this.sessions ? this.sessions.results : [];
        },
        ...mapState(["session", "sessions", "race", "context", "processing"])
    },
    created() {},
    mounted() {

    },
    deleted() {},
    methods: {
        ...mapMutations(["updateUI"]),
        load() {
            this.updateUI({title: "Programme"})
            if (this.sessions.results.length == 0) {
                this.$emit("start-loading");
                this.$store.dispatch("loadSessions").then(r => {
                    this.$emit("end-loading");
                }).catch(err => {
                    this.$emit("end-loading");
                });
            } else {
                this.$emit("end-loading");
            }
        },
        scrollSessionList() {
            let i,
                idx = 0;

            for (i = 0; i < this.sessions.results.length; i++) {
                if (this.sessions.results[i]._selected) {
                    idx = i;
                    break;
                }
            }
            if (this.$refs.sessionList)
                this.$refs.sessionList.$el.nativeView.scrollToIndex(
                    idx,
                    true,
                    ListViewItemSnapMode.Center
                );
        },
        onSessionTap(session) {
            this.$store.commit("setSession", session);
        },
        onTapDate() {
            this.$showModal(SessionSearch).then(r => {
                this.$store.dispatch("loadSessions");
            });
        },
        onPrevDay() {
            this.$store.commit("setContext", {
                day: this.context.day.subtract(1, "days")
            });
            this.$store.dispatch("loadSessions");
        },
        onNextDay() {
            this.$store.commit("setContext", {
                day: this.context.day.add(1, "days")
            });
            this.$store.dispatch("loadSessions");
        },
        onRaceTap(args) {
            this.$emit('change-view', {
                view: "race",
                props: {
                    race: args.item
                }
            })
        }
    }
};
</script>

<style scoped lang="scss">
@import "~/styles/variables";

@keyframes race {
    0% {
        transform: scale(1, 0.5);
    }
    100% {
        transform: scale(1, 1);
    }
}


ActionBar {
    background-color: $purple;
    color: #fff;
}

// Custom styles
.filters {
    background-color: $purple;
    width: 100%;
    padding-top: 10;
    padding-bottom: 10;
    padding-left: 20;
    padding-right: 20;
    align-items: center;
    justify-content: space-between;

    &__item {
        border-radius: 0;
        border-width: 0;
        border: none;
        background-color: transparent;
        color: #fff;
        font-size: 20;
        height: 40;
        margin: 0;
        padding: 0;
        text-align: center;

        label {
            background-color: transparent;
        }

        &--nav {
            width: 20;
            height: 20;
            font-size: 10;
        }

        &--date {
            text-align: center;
            background-color: transparent;
            color: #fff;
            font-size: 20;
            width: auto;

            image {
                width: 30;
                height: 30;
                margin-right: 5;
            }
        }
    }
}

.sessions {
    background-color: #ffdef1;
    color: #fff;
    height: 90;

    .empty {
        color: #ccc;
        font-size: 14;
    }

    &__item {
        background-color: $purple;
        height: 70;
        padding: 0;
        margin-left: 10;
        margin-right: 0;
        width: 140;
        border-radius: 0;
        border-color: $purple;
        border-width: 0;
        text-align: center;

        &--active {
            background-color: $yellow;

            label {
                &.num {
                    color: #fff;
                }
                &.name {
                    color: $purple;
                }
                &.country {
                    color: #333;
                }
            }
        }

        label {
            padding: 0;
            font-size: 15;

            &.num {
                font-size: 20;
            }
            &.name {
                font-size: 15;
            }
            &.country {
                font-size: 10;
                color: #ccc;
            }
        }
    }
}

.session-details {
    background-color: transparent;

    .empty {
        font-size: 14;
        Image {
            height: 50;
            width: 50;
            color: #ccc;
            margin-bottom: 20;
        }
        text-align: center;
        color: #ccc;
        margin-left: 20;
        margin-right: 20;
    }
}

.session-header {
    font-size: 20;
    color: $purple;
    text-align: center;
}

.races {
    background-color: #f6f6f6;

    &__item {
        background-color: #f6f6f6;
        color: $purple;
        border-bottom-width: 3;
        border-color: #ccc;
        padding: 10;
        margin-bottom: 10;
        text-align: left;
        font-size: 10;

        animation-name: race;
        animation-duration: 250ms;

        .item__title {
            font-size: 20;
            text-align: center;
            margin-right: 20;
        }

        .item__date {
            text-align: right;
            font-size: 18;
        }

        .item__info {
            font-size: 10;
            padding: 0;
            color: #333;
        }

        .winner-icon {
            height: 10;
            width: 10;
        }
    }
}
</style>