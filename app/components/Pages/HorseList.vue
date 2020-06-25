<template>
    <Page @onNavigatedTo="onNavigated">
        <ActionBar flat>
            <Label class="page-title" text="Chevaux"></Label>
        </ActionBar>

        <GridLayout>
            <GridLayout rows="auto, *" cols="*">
                <GridLayout row="0" class="searchbar">
                    <SearchBar hint="rechercher un cheval..." v-model="q" @textChange="onTextChange" @submit="onSubmit" @clear="onClear" />
                </GridLayout>

                <GridLayout row="1" class="results">
                    <RadListView for="horse in horses.results" @itemTap="onHorseTap">
                        <v-template>
                            <StackLayout>
                                <GridLayout columns="*, auto" class="results__item">
                                    <Label row="0" col="0" class="name" :text="horse.name"></Label>
                                    <Label row="0" col="1" :text="horse.breed"></Label>
                                </GridLayout>
                            </StackLayout>
                        </v-template>
                    </RadListView>
                </GridLayout>
            
            </GridLayout>
            <ActivityIndicator color="#9E0059" :busy="processing.sessions" height="50" width="50" />
        </GridLayout>
    </Page>
</template>

<script>
import { mapState } from "vuex";

import HorseDetails from "./HorseDetails";

export default {
    data() {
        return {
            q: ''
        }
    },
    computed: {
        ...mapState(["horses", "processing"])
    },
    methods: {
        onNavigated() {
            if( !this.q && !this.horses.results.length ) {
                this.$store.dispatch('loadHorses', this.q)    
            }
        },
        onTextChange() {
            this.$store.dispatch('loadHorses', this.q)
        },
        onSubmit() {
            this.$store.dispatch('loadHorses', this.q)
        },
        onClear() {
            this.$store.commit('clearHorses')
        },
        onHorseTap(args) {
            this.$navTo(HorseDetails, {
                frame: "stats",
                transition: {
                    name: "slide",
                    duration: 200,
                    curve: "ease"
                },
                animated: true,
                props: {
                    context: args.item
                }
            })
        }
    }
}
</script>

<style scoped lang="scss">
@import "~/styles/variables";

ActionBar {
    background-color: $purple;
    color: #fff;
}

.searchbar {
    margin: 20;
    padding: 0;
    background-color: transparent;
    background-color: #fff;
    border-width: 3;
    border-radius: 3;
    border-color: $purple;

    SearchBar {
        font-size: 20;
        margin: 0;
        padding: 0;
    }
}

.results {
    background-color: transparent;

    &__item {
        font-size: 12;
        padding: 5;
        color: #333;
        border-bottom-width: 1;
        border-color: #ccc;
        background-color: transparent;

        .name {
            color: $purple;
            font-size: 15;
            background-color: transparent;
        }
    }
}

</style>