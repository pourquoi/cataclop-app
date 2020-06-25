<template>
    <Page>
        <GridLayout rows="auto, auto, auto" class="content">

            <StackLayout height="100">

                <GridLayout columns="*" rows="auto, auto" class="player">
                    <Label class="odds" row="0" col="0" text="Dernier rapport direct"></Label>
                    <Label class="" row="1" col="0" text="Dernier rapport référence"></Label>
                </GridLayout>

                <TextView editable="false">
                    <FormattedString>
                        <Span text="Le dernier rapport et dernier rapport de référence PMU.fr" />
                    </FormattedString>
                </TextView>

            </StackLayout>

            <StackLayout row="1">

                <GridLayout columns="*" rows="auto, auto" class="player">
                    <Label class="trueskill" row="0" col="0" text="TrueSkill mu"></Label>
                    <Label row="1" col="0" text="TrueSkill sigma"></Label>
                </GridLayout>

                <TextView editable="false">
                    <FormattedString>
                        <Span text="TrueSkill" fontWeight="Bold" />
                        <!--
                        TrueSkill is a skill-based ranking system developed by Microsoft for use 
                        with video game matchmaking on Xbox Live. Unlike the popular Elo rating system,
                         which was initially designed for chess, TrueSkill is designed to support games with more than two players.[1][2]"
                        -->
                        <Span text=" est un système de classement développé par Microsoft pour ses jeux vidéos en ligne. " />
                        <Span text="Il repose sur le même principe que le système Elo pour les echècs mais supporte plusieurs joueurs par match. " />
                        <Span text="Le talent (skill) d'un joueur est représenté par une distribution normale d'une moyenne " />
                        <Span text="TrueSkill mu" fontWeight="Bold" />
                        <Span text=" et d'une variance " />
                        <Span text="TrueSkill sigma" fontWeight="Bold" />
                        <Span text=". La moyenne initiale est de " /><Span text="25" fontWeight="Bold" />
                        <Span text=" et la variance initiale est de " /><Span text="8" fontWeight="Bold" />
                        <Span text=". Plus la moyenne est grande, plus le cheval est bon. " />
                        <Span text="Plus la variance est petite, plus la moyenne est précise." />
                    </FormattedString>
                </TextView>

            </StackLayout>

            <StackLayout row="2">

                <GridLayout columns="*" rows="auto, auto" class="player">
                    <Label class="prediction" row="0" col="0" text="Prédiction"></Label>
                </GridLayout>

                <TextView editable="false">
                    <FormattedString>
                        <Span text="Chaque matin, une prédiction automatique est réalisée pour les courses du jour et du lendemain." />
                        <Span text=" Plus la valeur est petite, plus le cheval à de chances de finir premier." />
                    </FormattedString>
                </TextView>

            </StackLayout>


        </GridLayout>
    </Page>
</template>

<style scoped lang="scss">
@import "~/styles/variables";

.content {
    padding: 10;
}

.trueskill {
    color: $orange;
}

.player {
    color: #333;
    background-color: #F8F8F8;
    background-color: transparent;
    border-bottom-width: 1;
    border-color: #C6C6C6;

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
}
</style>

