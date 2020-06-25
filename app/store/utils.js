export function sortPlayers(a, b) {
    if (!a.position && !b.position) {
        return a.num < b.num ? -1 : 1
    } else if (!a.position) {
        return 1
    } else if (!b.position) {
        return -1
    } else {
        return a.position < b.position ? -1 : 1
    }
}

export function parseRace(race) {
    let i, winner = null;
    race._selected = false
    if (race.player_set) {
        for (i = 0; i < race.player_set.length; i++) {
            let player = race.player_set[i];
            player._selected = false;
            if (player && player.position == 1)
                race._winner = player.num
        }
    }
    return race
}

export function parsePlayer(player) {
    player.earnings = player.earnings / 100.
    player.victory_earnings = player.victory_earnings / 100.
    player.placed_earnings = player.victory_earnings / 100.

    return player;
}