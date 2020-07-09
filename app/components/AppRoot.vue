<template>
    <Page :actionBarHidden="ui.hideActionBar">
        <ActionBar flat ref="actbar" class="actionbar" v-if="$isAndroid">
            <GridLayout columns="*" rows="50" width="100%">
                <!--
                <Image
                    src.decode="font://&#xf104;"
                    class="fas actionbar--back"
                    @tap="goBack"
                    v-show="false"
                    col="0"
                    verticalAlignment="center"
                    horizontalAlignment="left"
                ></Image>
                -->
                <Label :text="ui.title" class="actionbar--title" col="0" verticalAlignment="center" />
            </GridLayout>
        </ActionBar>

        <GridLayout rows="*, 80">

        <AbsoluteLayout height="100%" width="100%">
            <PageI v-show="isVisible('races')" v-slot:default="slotProps">
                <DailyRaces
                    @start-loading="slotProps.startLoading"
                    @end-loading="slotProps.endLoading"
                    @toggle-loading="slotProps.toggleLoading"
                    ref="races"
                    @change-view="changeView"
                />
            </PageI>
            <PageI v-show="isVisible('race')" v-slot:default="slotProps">
                <RaceDetails
                    @start-loading="slotProps.startLoading"
                    @end-loading="slotProps.endLoading"
                    @toggle-loading="slotProps.toggleLoading"
                    ref="race"
                    @change-view="changeView"
                />
            </PageI>
            <PageI v-show="isVisible('search')" v-slot:default="slotProps">
                <HorseList
                    @start-loading="slotProps.startLoading"
                    @end-loading="slotProps.endLoading"
                    @toggle-loading="slotProps.toggleLoading"
                    ref="search"
                    @change-view="changeView"
                />
            </PageI>
            <PageI v-show="isVisible('horse')" v-slot:default="slotProps">
                <HorseDetails
                    @start-loading="slotProps.startLoading"
                    @end-loading="slotProps.endLoading"
                    @toggle-loading="slotProps.toggleLoading"
                    ref="horse"
                    @change-view="changeView"
                />
            </PageI>
            <PageI v-show="isVisible('horserace')" v-slot:default="slotProps">
                <RaceDetails
                    @start-loading="slotProps.startLoading"
                    @end-loading="slotProps.endLoading"
                    @toggle-loading="slotProps.toggleLoading"
                    ref="horserace"
                    @change-view="changeView"
                />
            </PageI>
        </AbsoluteLayout>

        <FlexboxLayout row="1" class="menu">

            <StackLayout class="menu__item" :class="{active: currentView == 'races'}" @tap="changeView({view: 'races', props:{}})">
                <Image src.decode="font://&#xf073;" class="fas"></Image>
                <Label text="Programme"></Label>
            </StackLayout>

            <StackLayout v-if="race" class="menu__item" :class="{active: isCurrentRace}" @tap="changeView({view: 'race', props:{}})">
                <Image src.decode="font://&#xf11e;" class="fas"></Image>
                <Label text="Course"></Label>
            </StackLayout>

            <StackLayout v-if="horse" class="menu__item" :class="{active: isCurrentHorse}" @tap="changeView({view: 'horse', props:{}})">
                <Image src.decode="font://&#xf6f0;" class="fas"></Image>
                <Label text="Cheval"></Label>
            </StackLayout>

            <StackLayout class="menu__item" :class="{active: currentView == 'search'}" @tap="changeView({view: 'search', props:{}})">
                <Image src.decode="font://&#xf002;" class="fas"></Image>
                <Label text="Recherche"></Label>
            </StackLayout>

        </FlexboxLayout>
        </GridLayout>

    </Page>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import * as application from "application";
import {
    AndroidApplication,
    AndroidActivityBackPressedEventData
} from "application";
import { isAndroid } from "platform";
import * as firebase from"nativescript-plugin-firebase";

import * as effects from "@/utils/effects";
import PageI from "./Pages/PageI";
import RaceDetails from "./Pages/RaceDetails";
import DailyRaces from "./Pages/DailyRaces";
import HorseList from "./Pages/HorseList";
import HorseDetails from "./Pages/HorseDetails";

export default {
    data() {
        return {
            navigation: [],
            visible: ["races"],
            currentView: "races"
        };
    },
    components: {
        PageI,
        DailyRaces,
        HorseList,
        HorseDetails,
        RaceDetails
    },
    computed: {
        navEntry() {
            return (this.navigation.length > 0 ? this.navigation[this.navigation.length - 1] : null);
        },
        canGoBack() {
            return this.navigation.length > 1;
        },
        isCurrentRace() {
            return (this.navEntry && (this.currentView == 'race') && this.race
                    && this.navEntry.props && 
                    ( !this.navEntry.props.race || (this.navEntry.props.race.id == this.race.id)))
        },
        isCurrentHorse() {
            return (this.navEntry && (this.currentView == 'horse') && this.horse
                    && this.navEntry.props && 
                    (!this.navEntry.props.horse || (this.navEntry.props.horse.id == this.horse.id)))
        },
        ...mapState(["frame", "ui", "horse", "race"])
    },
    mounted() {

        if (isAndroid) {
            application.android.on(
                AndroidApplication.activityBackPressedEvent,
                data => {
                    
                    if (this.canGoBack) {

                        let entry = this.navigation.pop()

                        if(entry.view !== '__modal__') {
                            this.navigation.push(entry)
                            this.goBack()
                            data.cancel = true
                        }

                    }
                }
            );
        }

        this.navigation.push({ view: "races", props: {} });
        this.$refs[this.currentView].load();
    },
    methods: {
        goBack() {
            if(!this.canGoBack) return;

            this.navigation.pop()
            let entry = this.navigation.pop()

            if(entry.view == '__modal__') {
                this.$modal.close()
            } else {
                this.changeView(entry, true)
            }
        },
        isVisible(view) {
            return this.visible.includes(view);
        },
        hide(view) {
            let i = this.visible.indexOf(view);
            if (i < 0) return;
            this.visible.splice(i, 1);
        },
        changeView({ view, props }, back = false) {

            if(view === '__modal__') {

                if(props && props.close) {
                    if(this.navEntry && this.navEntry.view == '__modal__') {
                        this.navigation.pop()
                    }
                } else {
                    this.navigation.push({ view: view, props: props });
                }
                return;
            }
            
            return new Promise((resolve, reject) => {
                let startAfter = Promise.resolve();

                let res = this.$refs[view].load(props, back);

                startAfter.then(() => {
                    this.visible.push(view);

                    let leavingView = this.currentView;
                    let anims = [];

                    if(view === this.currentView) {
                        anims.push(Promise.resolve())
                    } else {
                                                
                        firebase.analytics.logEvent({
                            key: "page_view",
                            parameters: [
                                {
                                    key: "page_id",
                                    value: view
                                }
                            ]
                        });

                        this.navigation.push({ view: view, props: props });

                        if(this.navigation.length > 30) {
                            this.navigation.splice(0, 10);
                        }

                        anims.push(
                            effects.leave(
                                this.$refs[leavingView].$parent.nativeView,
                                { to: !back ? "left" : "right", opacity: 1 }
                            )
                        );

                        anims.push(
                            effects.welcome(this.$refs[view].$parent.nativeView, {
                                from: !back ? "right" : "left",
                                opacity: 1
                            })
                        );
                    }

                    Promise.all(anims).then(() => {
                        this.hide(leavingView);

                        this.currentView = view;

                        resolve();
                    });
                });
            });
        }
    }
};
</script>

<style scoped lang="scss">
@import "~/styles/variables";

@keyframes menu-item-active {
    0% {
        transform: rotate(0);
        color: #fff;
    }
    100% {
        transform: rotate(360);
        color: $yellow;
    }
}

.menu {
    margin: 0;
    padding: 10;
    align-items: center;
    justify-content: space-around;
    background-color: $purple;

    &__item {
        padding-left: 20;
        padding-right: 20;
        color: #fff;
        font-size: 10;
        text-transform: uppercase;
        background-color: $purple;
        font-weight: normal;

        image.fas {
            height: 30;
            width: 30;
            color: #fff;
        }

        &.active {
            background-color: $purple;
            color: $yellow;
            font-weight: bold;

            image.fas {
                animation-name: menu-item-active;
                animation-duration: 0.3s;
                animation-delay: 0s;
                animation-timing-function: linear;
            }
        }
    }
}
</style>

<style lang="scss">
@import "~@nativescript/theme/css/core.css";
@import "~@nativescript/theme/css/default.css";
@import "~/styles/variables";

ActionBar.actionbar {
    background-color: $purple;
    color: #fff;
    
    .actionbar--title {
        font-size: 20;
        text-transform: uppercase;
        color: #fff;
    }

    .actionbar--back {
        color: #fff;
        height: 30;
        width: 30;
    }
}

TabStrip {
    selected-item-color: $yellow;
    un-selected-item-color: #faedcb;
    highlight-color: $orange;

    background-color: $purple;
    font-size: 18;

    &:active {
        font-size: 20;
    }
}

TabContentItem.races {
    Page {
        background-color: #fbfbfb;
    }
}

TabContentItem.stats {
    Page {
        background-color: #fbfbfb;
    }
}
</style>