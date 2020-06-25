<template>
    <Page @navigatedTo="onNavigated">
        <ActionBar flat>
            <!--
            <NavigationButton @tap="$navigateTo(Home)" android.systemIcon="ic_menu_back" />
            -->
            <Label class="page-title" text="Courses"></Label>
        </ActionBar>

        <GridLayout>
            <GridLayout rows="80, *" cols="*">
                <FlexboxLayout row="0" horizontalAlignment="center" orientation="horizontal" class="filters" :class="{enabled: !processing.sessions}">
                    <StackLayout class="filters__item filters__item--nav">
                        <Image src.decode="font://&#xf053;" class="fas" @tap="onPrevDay"/>
                    </StackLayout>
                    <StackLayout class="filters__item filters__item--date" orientation="horizontal" @tap="onTapDate">
                        <Image src.decode="font://&#xf274;" class="fas" verticalAlignment="center" horizontalAlignment="center" />
                        <Label
                            verticalAlignment="center"
                            horizontalAlignment="right"
                            :isEnabled="!processing.sessions"
                            :text="context.day | date"
                        />
                    </StackLayout>
                    <StackLayout class="filters__item filters__item--nav">
                        <Image src.decode="font://&#xf054;" class="fas" @tap="onNextDay"/>
                    </StackLayout>
                </FlexboxLayout>

                <GridLayout row="1" rows="auto, *">
                    
                    <GridLayout row="0" class="sessions">
                        <RadListView ref="sessionList" orientation="horizontal" for="s in sessions.results" @itemTap="onSessionTap">
                            <v-template>
                                <GridLayout>
                                <StackLayout class="sessions__item" :class="{'sessions__item--active': s._selected}">
                                    <Label :text="'R' + s.num" class="num" />
                                    <Label :text="s.hippodrome.name" class="name" />
                                    <Label :text="'(' + s.hippodrome.country + ')'" class="country" />
                                </StackLayout>
                                </GridLayout>
                            </v-template>
                        </RadListView>
                    </GridLayout>
                    

                    <!--
                    <ListPicker :items="sessionsList" @selectedIndexChange="onSelectSession" />
                    -->
                    
                    <GridLayout row="1" class="session-details">
                        <StackLayout v-if="session">

                            <RadListView class="races" for="race in session.race_set" @itemTap="onRaceTap">
                                <v-template>
                                    <StackLayout class="races__item">
                                        <GridLayout columns="auto, *, *" rows="20, 20, 20">
                                            <Label rowSpan="3" row="0" col="0" :text="'R' + session.num + 'C' + race.num" class="item__title"></Label>
                                            <Label class="item__info" row="0" col="1" :text="race.sub_category"></Label>
                                            <Label class="item__info" row="1" col="1" :text="race.declared_player_count + ' partants'"></Label>
                                            <Label class="item__info" row="2" col="1" :text="race.prize | price(0)"></Label>
                                            <Label rowSpan="3" row="0" col="2" :text="race.start_at | time" class="item__date"></Label>
                                        </GridLayout>
                                    </StackLayout>
                                </v-template>
                            </RadListView>
                        </StackLayout>
                    </GridLayout>

                </GridLayout>

            </GridLayout>
            <ActivityIndicator color="#9E0059" :busy="processing.sessions" height="50" width="50" />
        </GridLayout>
    </Page>
</template>

<script>
import { mapState } from "vuex";

import moment from 'moment';
moment.locale('fr');

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
            tabCreationHandler: null
        };
    },
    computed: {
        sessionsList() {
            return this.sessions.results.map(s => ('R' + s.num + ' ' + s.hippodrome.name))
        },
        results() {
            return this.sessions ? this.sessions.results : []
        },
        ...mapState(["session", "sessions", "race", "context", "processing"])
    },
    created() {},
    mounted() {
    
    },
    deleted() {
        
    },
    methods: {
        scrollSessionList() {
            let i, idx = 0;

            for(i=0; i < this.sessions.results.length; i++) {
                if( this.sessions.results[i]._selected ) {
                    idx = i;
                    break;
                }
            }
            if(this.$refs.sessionList)
                this.$refs.sessionList.$el.nativeView.scrollToIndex(idx, true, ListViewItemSnapMode.Center);
        },
        templateSelector(item, idx, items) {
            if(!this.session || this.session.id != item.id) return 'default'
            if(item.id == this.session.id) return 'active'
        },
        onSelectSession(e) {
            console.log(e.value)
            if( e.value < this.sessions.results.length )
            this.$store.commit('setSession', this.sessions.results[e.value])
        },
        onSessionTap(args) {
            this.$store.commit('setSession', args.item)
        },
        onNavigated() {
            if( this.sessions.results.length == 0 )
                this.$store.dispatch("loadSessions")
                    .then(r => {
                        setTimeout( () => this.scrollSessionList(), 500 )
                    })
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
            this.$navTo(RaceDetails, {
                frame: "races",
                transition: {
                    name: "slide",
                    duration: 200,
                    curve: "ease"
                },
                animated: true,
                props: {
                    context: args.item,
                    frame: "races"
                }
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

        Label {
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

            Image {
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
            
            Label {
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

        Label {
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