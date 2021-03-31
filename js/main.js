window.onload = function() {
    config = {
        actual_set: 1,
        service: '',
        golden_point: true,
        tie_break: true,
        won_set_limit: 2,
    };

    actual_tie_break_set = false;
    won_sets_counter__home =  0;
    won_sets_counter__adv = 0;
    document.getElementById('commands').focus();
    document.getElementById('commands').onkeyup = function(e) {
        // console.log(e.which);
        if (e.which == 81) {
            show_hide_scoreboard();
        } else if (e.which == 87) {
            show_hide_allsets();
        } else if (e.which == 69) {
            show_hide_points();
        } else if (e.which == 82) {
            reset_actual_set();
        } else if (e.which == 65) {
            set_point('home','add');
        } else if (e.which == 83) {
            set_point('adv','add');
        } else if (e.which == 68) {
            set_point('home','rem');
        } else if (e.which == 70) {
            set_point('adv','rem');
        } else if (e.which == 90) {
            set_service('home');
        } else if (e.which == 88) {
            set_service('adv');
        } else if (e.which == 67) {
            reset_actual_setpoints();
        } else if (e.which == 86) {
            remove_all_sets();
        }
    };

    // OnChange events for configuration
    document.getElementById('config__golden_point').onchange = function(e) {
        set_config('golden_point',this.checked ? true : false);
    };
    document.getElementById('config__tie_break').onchange = function(e) {
        set_config('tie_break',this.checked ? true : false);
    };
};

function set_config(str, boo) {
    if (boo !== undefined) {
        config[str] = boo;
    } else {
        config[str] = false;
    }
}

function reset_config() {
    if (config.actual_set > 1) {
        config.actual_set--;
    } else {
        config.actual_set = 0;
    }
}

function setPlayerName(ev) {
    ev.preventDefault();
    var playerId = document.getElementById(ev.target.dataset.player);
    if (ev.target.value !== '') {
        playerId.textContent = ev.target.value;
    } else {
        playerId.textContent = '-';
    }
}

function resetAllPlayersName() {
    var player_names = document.querySelectorAll('.match_controls .player_name');
    var players = document.querySelectorAll('.scoreboard__names .player');
    for (var p in players) {
        if (Object.hasOwnProperty.call(players, p)) {
            var player = players[p];
            var player_name = player_names[p];
            player.textContent = '-';
            player_name.value = '';
        }
    }
}

function show_hide_scoreboard(boo) {
    var scoreboard = document.getElementById('scoreboard');
    if (boo != undefined) {
        if (boo) {
            scoreboard.classList.add('show');
        } else {
            scoreboard.classList.remove('show');
        }
    } else {
        scoreboard.classList.toggle('show');
    }
}

function show_hide_allsets(boo) {
    
    var sets_container = document.getElementById('scoreboard__sets--container');
    if (boo !== undefined) {
        if (boo) {
            sets_container.classList.add('show');
        } else {
            sets_container.classList.remove('show');
        }
    } else {
        sets_container.classList.toggle('show');
    }

    var scoreboard_sets = document.querySelectorAll('.scoreboard__set');
    for (var key in scoreboard_sets) {
        if (Object.hasOwnProperty.call(scoreboard_sets, key)) {
            if (sets_container.classList.contains('show')) {
                scoreboard_sets[key].classList.add('show');
            } else {
                scoreboard_sets[key].classList.remove('show');
            }
        }
    }
    
    show_hide_points(false);
}

function show_hide_points(boo) {
    var scoreboard__set_points = document.querySelector('.scoreboard__set[data-setid="'+ config.actual_set +'"] .scoreboard__set_points');
    if (boo !== undefined) {
        if (boo) {
            scoreboard__set_points.classList.add('show');
        } else {
            scoreboard__set_points.classList.remove('show');
        }
    } else {
        scoreboard__set_points.classList.toggle('show');
    }
}

function reset_actual_setpoints() {
    var scoreboard__set_scores = document.querySelectorAll('.scoreboard__set[data-setid="'+ config.actual_set +'"] .scoreboard__set_points .score');
    for (var key in scoreboard__set_scores) {
        if (Object.hasOwnProperty.call(scoreboard__set_scores, key)) {
            var score = scoreboard__set_scores[key];
            score.textContent = '0';
        }
    }
    // Hiding points of first set which is never removed.
    show_hide_points(false);
}

function reset_actual_set() {
    var scoreboard__set_scores = document.querySelectorAll('.scoreboard__set[data-setid="'+ config.actual_set +'"] .score');
    for (var key in scoreboard__set_scores) {
        if (Object.hasOwnProperty.call(scoreboard__set_scores, key)) {
            var score = scoreboard__set_scores[key];
            score.textContent = '0';
        }
    }
    // Hiding points of first set which is never removed.
    show_hide_points(false);
}

function remove_all_sets() {
    var scoreboard_sets = document.querySelectorAll('.scoreboard__set');
    for (var key in scoreboard_sets) {
        if (Object.hasOwnProperty.call(scoreboard_sets, key)) {
            if (config.actual_set > 1 && scoreboard_sets[key].dataset.setid == config.actual_set) {
                scoreboard_sets[key].remove();
                reset_config();
            }
        }
    }
    // Reset point from first set wich is the actual set now.
    reset_actual_set();
    // Hiding points of first set which is never removed.
    show_hide_points(false);
    // Hiding all sets from the match.
    show_hide_allsets(false);
    // Reset service.
    reset_service();
    
    won_sets_counter__home =  0;
    won_sets_counter__adv = 0;
}

function show_hide_goldenpoint(boo) {
    var scoreboard_setpoints = document.querySelector('.scoreboard__set[data-setid="'+ config.actual_set +'"] .scoreboard__set_points');
    if (boo !== undefined) {
        if (boo) {
            scoreboard_setpoints.classList.add('golden');
        } else {
            scoreboard_setpoints.classList.remove('golden');
        }
    } else {
        scoreboard_setpoints.classList.toggle('golden');
    }
}

function setHomeSetScore(score) {
    document.querySelector('.scoreboard__set[data-setid="'+ config.actual_set +'"] .set--a .score').textContent = score;
}

function setAdvSetScore(score) {
    document.querySelector('.scoreboard__set[data-setid="'+ config.actual_set +'"] .set--b .score').textContent = score;
}

function getHomeSetScore() {
    return document.querySelector('.scoreboard__set[data-setid="'+ config.actual_set +'"] .set--a .score');
}

function getAdvSetScore() {
    return document.querySelector('.scoreboard__set[data-setid="'+ config.actual_set +'"] .set--b .score');
}

function setHomeSetpointScore(score) {
    document.querySelector('.scoreboard__set[data-setid="'+ config.actual_set +'"] .set_point--a .score').textContent = score;
}

function setAdvSetpointScore(score) {
    document.querySelector('.scoreboard__set[data-setid="'+ config.actual_set +'"] .set_point--b .score').textContent = score;
}

function getHomeSetpointScore() {
    return document.querySelector('.scoreboard__set[data-setid="'+ config.actual_set +'"] .set_point--a .score');
}

function getAdvSetpointScore() {
    return document.querySelector('.scoreboard__set[data-setid="'+ config.actual_set +'"] .set_point--b .score');
}

function createNewSet() {

    var scoreboard__set = document.createElement('div');
    scoreboard__set.className = 'f-left scoreboard__set newset show';
    scoreboard__set.dataset.setid = config.actual_set;

    var set_container = document.createElement('div');
    set_container.className = 'set-container';
    

    var set = document.createElement('div');
    set.className = 'set set--a';
    
    var score = document.createElement('span');
    score.className = 'score';
    score.textContent = 0;
    set.appendChild(score);
    set_container.appendChild(set);

    var set = document.createElement('div');
    set.className = 'set set--b';
    set_container.appendChild(set);

    var score = document.createElement('span');
    score.className = 'score';
    score.textContent = 0;
    set.appendChild(score);
    set_container.appendChild(set);
    
    
    var scoreboard__set_points = document.createElement('div');
    scoreboard__set_points.className = 'scoreboard__set_points';


    var set_point = document.createElement('div');
    set_point.className = 'set_point set_point--a';
    
    var score = document.createElement('span');
    score.className = 'score';
    score.textContent = 0;
    set_point.appendChild(score);
    scoreboard__set_points.appendChild(set_point);

    var set_point = document.createElement('div');
    set_point.className = 'set_point set_point--b';
    scoreboard__set_points.appendChild(set_point);

    var score = document.createElement('span');
    score.className = 'score';
    score.textContent = 0;
    set_point.appendChild(score);
    scoreboard__set_points.appendChild(set_point);

    scoreboard__set.appendChild(set_container);
    scoreboard__set.appendChild(scoreboard__set_points);

    document.getElementById('scoreboard__sets--container').appendChild(scoreboard__set);

}

function removeGame(side) {
    // Setting SET SCORE
    var score = 0;
    if (side == 'home') {
        score = parseInt(getHomeSetScore().textContent);
        if (score > 0) {
            setHomeSetScore(parseInt(getHomeSetScore().textContent) - 1);
            return true;
        }
    } else {
        score = parseInt(getAdvSetScore().textContent);
        if (score > 0) {
            setAdvSetScore(parseInt(getAdvSetScore().textContent) - 1);
            return true;
        }
    }
    return false;
}

function set_game(side) {
    // Reset SET POINTS
    console.log('Home: '+won_sets_counter__home);
    console.log('Adv: '+won_sets_counter__adv);
    reset_actual_setpoints();
    if (side == 'home') {
        var a_score = parseInt(getHomeSetScore().textContent) + 1;
        var b_score = parseInt(getAdvSetScore().textContent);
        setHomeSetScore(a_score);
        set_service('adv');
    } else {
        var a_score = parseInt(getAdvSetScore().textContent) + 1;
        var b_score = parseInt(getHomeSetScore().textContent);
        setAdvSetScore(a_score);
        set_service('home');
    }

    if (a_score > b_score && a_score > 5 && (a_score - b_score) >= 2 || actual_tie_break_set) {
        // Create another SET
        if (side == 'home') {
            won_sets_counter__home++;
        } else {
            won_sets_counter__adv++;
        }
        if (won_sets_counter__home < config.won_set_limit && won_sets_counter__adv < config.won_set_limit) {
            config.actual_set++;
            actual_tie_break_set = false;
            createNewSet();
        }
        
            console.log('Home: '+won_sets_counter__home);
            console.log('Adv: '+won_sets_counter__adv);
            console.log('--------------')
    }
}

function set_point(side, action) {
    if (side === undefined || action === undefined) {
        return false;
    }

    // Continue script if param is defined
    if (side == 'home') {
        // Getting SetPoint Score for Home
        var a_setpoint_score = getHomeSetpointScore();
        // Getting Set Score for Home
        var a_set_score = getHomeSetScore();
        // Getting SetPoint Score for Adv
        var b_setpoint_score = getAdvSetpointScore();
        // Getting Set Score for Adv
        var b_set_score = getAdvSetScore();
    } else {
        // Getting SetPoint Score for Home
        var a_setpoint_score = getAdvSetpointScore();
        // Getting Set Score for Home
        var a_set_score = getAdvSetScore();
        // Getting SetPoint Score for Adv
        var b_setpoint_score = getHomeSetpointScore();
        // Getting Set Score for Adv
        var b_set_score = getHomeSetScore();
    }
    if (config.service == '') {
        set_service(side);
    }
    // Forcing to show allSets and setpoints on screen

    show_hide_allsets(true);

    if (config.tie_break && parseInt(a_set_score.textContent) == 6 
        && parseInt(b_set_score.textContent) == 6) 
    {
        // Setting next score for tie break;
        if (parseInt(a_setpoint_score.textContent) > parseInt(b_setpoint_score.textContent)
            && parseInt(a_setpoint_score.textContent) > 5
            && (parseInt(a_setpoint_score.textContent + 1) - parseInt(b_setpoint_score.textContent) >= 2)) 
        {
            actual_tie_break_set = true;
            set_game(side);
        } else {
            if (action == 'add') {
                if (side == 'home') {
                    setHomeSetpointScore(parseInt(a_setpoint_score.textContent)+1);
                } else {
                    setAdvSetpointScore(parseInt(a_setpoint_score.textContent)+1);
                }
                set_service(side);
            } else {
                if (parseInt(a_setpoint_score.textContent) > 0) {
                    if (side == 'home') {
                        setHomeSetpointScore(parseInt(a_setpoint_score.textContent)-1);
                    } else {
                        setAdvSetpointScore(parseInt(a_setpoint_score.textContent)-1);
                    }
                } else {
                    removeGame(side);
                }
                set_service(side);
            }
            show_hide_points(true);
        }

        // In case of Tie Break, stop the function flow.
        return false;
    }

    switch (a_setpoint_score.textContent) {
        case '0':
            if (action == 'add') {
                if (side == 'home') {
                    setHomeSetpointScore(15);
                } else {
                    setAdvSetpointScore(15);
                }
                show_hide_points(true);
            } else {
                removeGame(side);
            }
            break;
        case '15':
            if (action == 'add') {
                if (side == 'home') {
                    setHomeSetpointScore(30);
                } else {
                    setAdvSetpointScore(30);
                }
                show_hide_points(true);
            } else {
                if (side == 'home') {
                    setHomeSetpointScore(0);
                } else {
                    setAdvSetpointScore(0);
                }
                show_hide_points(true);
            }
            break;
        case '30':
            if (action == 'add') {
                if (b_setpoint_score.textContent == '40') {
                    if (config.golden_point) {
                        // The match continues with a golden point.
                        show_hide_goldenpoint(true);
                    }
                }
                if (side == 'home') {
                    setHomeSetpointScore(40);
                } else {
                    setAdvSetpointScore(40);
                }
                show_hide_points(true);
            } else {
                if (side == 'home') {
                    setHomeSetpointScore(15);
                } else {
                    setAdvSetpointScore(15);
                }
                show_hide_points(true);
            }
            break;
        case '40':
            // If adv has 40 points, variable Score goes to ADV.
            if (action == 'add') {
                if (b_setpoint_score.textContent == '40') {
                    if (config.golden_point) {
                        set_game(side);
                        show_hide_goldenpoint(false);
                    } else {
                        a_setpoint_score.classList.add('adv');
                        if (side == 'home') {
                            setHomeSetpointScore('ADV');
                        } else {
                            setAdvSetpointScore('ADV');
                        }
                    }
                    show_hide_points(true);
                } else if (b_setpoint_score.textContent == 'ADV') {
                    b_setpoint_score.classList.remove('adv');
                    if (side == 'home') {
                        setHomeSetpointScore(40);
                    } else {
                        setAdvSetpointScore(40);
                    }
                    show_hide_points(true);
                } else {
                    set_game(side);
                }
            } else {
                if (side == 'home') {
                    setHomeSetpointScore(30);
                } else {
                    setAdvSetpointScore(30);
                }
                show_hide_points(true);
            }
            break;
        case 'ADV':
            if (action == 'add') {
                a_setpoint_score.classList.remove('adv');
                b_setpoint_score.classList.remove('adv');
                set_game(side);
            } else {
                if (side == 'home') {
                    setAdvSetpointScore(40);
                } else {
                    setHomeSetpointScore(40);
                }
                show_hide_points(true);
            }
            break;
        default:
            break;
    }
}

function set_service(side,trigger) {
    var scoreboard__service_a = document.querySelector('.scoreboard__names .team--a .scoreboard__service');
    var scoreboard__service_b = document.querySelector('.scoreboard__names .team--b .scoreboard__service');
    
    config.service = ''; // Reset set service to Default until change it.
    if (trigger === undefined) {
        if (side == 'home') {
            if (scoreboard__service_a.classList.contains('show')) {
                config.service = 'adv';
                scoreboard__service_b.classList.add('show');
                scoreboard__service_a.classList.remove('show');
            } else {
                config.service = 'home';
                scoreboard__service_b.classList.remove('show');
                scoreboard__service_a.classList.add('show');
            }
        } else {
            if (scoreboard__service_b.classList.contains('show')) {
                config.service = 'home';
                scoreboard__service_a.classList.add('show');
                scoreboard__service_b.classList.remove('show');
            } else {
                config.service = 'adv';
                scoreboard__service_a.classList.remove('show');
                scoreboard__service_b.classList.add('show');
            }
        }
    } else {
        if (side == 'home') {
            if (scoreboard__service_a.classList.contains('show')) {
                scoreboard__service_a.classList.remove('show');
            } else {
                config.service = 'home';
                scoreboard__service_b.classList.remove('show');
                scoreboard__service_a.classList.add('show');
            }
        } else {
            if (scoreboard__service_b.classList.contains('show')) {
                scoreboard__service_b.classList.remove('show');
            } else {
                config.service = 'adv';
                scoreboard__service_a.classList.remove('show');
                scoreboard__service_b.classList.add('show');
            }
        }
    }
}

function reset_service() {
    var scoreboard__service_a = document.querySelector('.scoreboard__names .team--a .scoreboard__service');
    var scoreboard__service_b = document.querySelector('.scoreboard__names .team--b .scoreboard__service');
    scoreboard__service_a.classList.remove('show');
    scoreboard__service_b.classList.remove('show');
    // Reset service in config object
    config.service = '';
}
