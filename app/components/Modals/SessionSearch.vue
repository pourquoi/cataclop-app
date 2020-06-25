<template>
    <Page>
        <ActionBar>
            <Label class="page-title" text="Sélectionner un jour" />
        </ActionBar>

        <StackLayout>
            <DatePicker :date="context.day.toDate()" @dateChange="onDateChange" />
            <Button text="ok" @tap="onSubmit" />
        </StackLayout>
    </Page>
</template>

<script>
import moment from "moment";
moment.locale('fr');

import { mapState } from "vuex";

import DailyRaces from "../Pages/DailyRaces";

export default {
    data() {
        return {
            date: null
        }
    },
    computed: {
        ...mapState(["context"])
    },
    methods: {
        onDateChange(e) {
            if( e.value )
                this.date = moment(e.value)
                
        },
        onSubmit() {
            if( this.date ) {
                this.$store.commit('setContext', {day: this.date})
                this.$store.dispatch("loadSessions")
            } 
            this.$modal.close()
        }
    }

}
</script>