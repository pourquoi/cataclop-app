<template>
    <Page :actionBarHidden="true">
        <GridLayout rows="*, auto">
            
            <BottomNavigation
                row="0"
                ref="nav"
            >
                <!--
                <TabStrip>
                    <TabStripItem>
                        <Label text="Courses"></Label>
                        <Image src.decode="font://&#xf11e;" class="fas t-36"></Image>
                    </TabStripItem>
                    <TabStripItem>
                        <Label text="Analyse"></Label>
                        <Image src.decode="font://&#xf6f0;" class="fas t-36"></Image>
                    </TabStripItem>
                </TabStrip>
                -->

                <TabContentItem class="races">
                    <Frame id="races">
                        <DailyRaces />
                    </Frame>
                </TabContentItem>

                <TabContentItem class="stats">
                    <Frame id="stats">
                        <HorseList />
                    </Frame>
                </TabContentItem>
            </BottomNavigation>
            
            <FlexboxLayout row="1" class="menu">

                <StackLayout class="menu__item" @tap="navToRaces" :class="{'active': frame == 'races'}">
                    <Image src.decode="font://&#xf073;" class="fas"></Image>
                    <Label text="Programme"></Label>
                </StackLayout>

                <StackLayout class="menu__item" :class="{'active': frame == 'stats'}" @tap="navToHorses">
                    <Image src.decode="font://&#xf00e;" class="fas"></Image>
                    <Label text="Analyse"></Label>
                </StackLayout>

            </FlexboxLayout>
        </GridLayout>
    </Page>
</template>

<script>
import { mapState } from "vuex";
import DailyRaces from "./Pages/DailyRaces";
import HorseList from "./Pages/HorseList";

export default {
    components: {
        DailyRaces,
        HorseList,
    },
    computed: {
        ...mapState(["frame"])
    },
    mounted() {
        this.$setNavFrames(["races", "stats"])
        this.$setNavView(this.$refs.nav.$el.nativeView);
    },
    methods: {
        navToRaces() {
            if( this.$nav.view.selectedIndex == 0 ) {
                this.$navTo(DailyRaces, {
                    frame: 'races'
                })
            } else {
                this.$nav.view.selectedIndex = 0;
            }
            this.$store.commit('setFrame', 'races')
        },

        navToHorses() {
            if( this.$nav.view.selectedIndex == 1 ) {
                this.$navTo(HorseList, {
                    frame: 'stats'
                })
            } else {
                this.$nav.view.selectedIndex = 1;
            }
            this.$store.commit('setFrame', 'stats')
        }
    }
};
</script>

<style scoped lang="scss">
@import "~/styles/variables";

@keyframes menu-item-active {
    0%   { transform: rotate(0); color: #fff; }
    100%   { transform: rotate(360); color: $yellow; }
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
        font-size: 14;
        text-transform: uppercase;
        background-color: $purple;
        font-weight: normal;

        Image.fas {
            height: 30;
            width: 30;
            color: #fff;
        }

        &.active {
            background-color: $purple;
            color: $yellow;
            font-weight: bold;

            Image.fas {
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
@import '~@nativescript/theme/css/core.css';
@import '~@nativescript/theme/css/default.css';
@import "~/styles/variables";

ActionBar {
    background-color: $purple;
    color: #fff;
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