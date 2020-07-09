<template>
    <AbsoluteLayout width="100%" height="100%">
        <GridLayout width="100%" height="100%">
            <slot v-bind:startLoading="startLoading" v-bind:endLoading="endLoading"
                v-bind:toggleLoading="toggleLoading">
            </slot>
        </GridLayout>
        <GridLayout width="100%" height="100%" v-show="loading" class="loading-content">
            <ActivityIndicator busy="true" width="100" />
        </GridLayout>
    </AbsoluteLayout>
</template>

<script>
    export default {
        data() {
            return {
                loading: false
            };
        },
        name: "PageI",
        methods: {
            startLoading() {
                this.loading = true;
            },
            endLoading() {
                this.loading = false;
            },
            toggleLoading() {
                this.loading = !this.loading;
            }
        }
    };
</script>

<style scoped lang="scss">
    @import "@/styles/variables";

    .loading-content {
        background-color: white;
        opacity: 0.5;
    }

    ActivityIndicator {
        color: $purple;
    }
</style>