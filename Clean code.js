    feb8fc30: function(e, t, a) {
        "use strict";
		
		// Static variables
		
		// et: s {pe: i, Ft: {…}, playerIds: Array(11), teamInfo: {…}, groupInfo: {…}, …} -> 
		var players_parent_key               = '$e';
		
		// aa: {3301: {…}, 3302: {…}, 3303: {…}, 3304: {…}, 3305: {…}, 3306:
		var players_child_key                = '$t';

		// It: r {idToObj: {…}, types: {…}, seenCount: 26}
		var objects_key                      = 'It';

		// At: 3135
		var player_id_key                    = 'Ct';
		
		// Et: n {bodySprite: e, chestSprite: e, helmetSprite: e, backpackSprite: e, handLSprite: e, …}
		var player_data_parent_key           = 'At';
		
		// ie: {pos: {…}, dir: {…}, skin: "outfitBase", backpack: "backpack00", helmet: "", …}
		var player_data_child_key            = 'ae';

		// ae: i {pos: {…}, ppu: 16, f: 2.1407452788602614, _: 2.142857142857143, screenWidth: 1920, …}
		var screen_key                       = 'te';

		// Fe: e {input: o, config: e, binds: Array(36), boundKeys: {…}, menuHovered: false}
		var zoom_variable_key                = 'je';
		
		// Re: o {touchElem: canvas#cvs, keys: {…}, keysOld: {…}, de: {…}, he: {…}, …}
		var input_parent_key                 = 'Fe';
		
		// de: {x: 14, y: 280}
		var input_child_key_mouse_pos        = 'pe';
		
		// search THIS FILE for "return !this.mouseButtonsOld[e] && !!this.mouseButtons[e]" -> and get the parent variable example: "ge:"
		var input_child_key                  = 'he';
		
		
		// search "b.opacity = S.smoothstep(v, 0, .25) * (1 - S.smoothstep(v, 6, 6.5))" and replace with "b.opacity = 1"
		// search "var m = 1600 * this.screenScaleFactor / 1.2" and replace with "var m = 800 * this.screenScaleFactor / 1.2"
		
		
		var consumables                      = a("4edcdb13");
		var throwables                       = a("0ae5a1da");
		var game_settings                    = a("989ad62a");
		var guns                             = a("d41d45f7");
		var skins                            = a("850480b2");
		var audio                            = a("0d807371");
		var structures                       = a("aca73f78");
		var bullets                          = a("cb171a86");
		
		var objects_visible;
		
		
		var player_lines_to_enemies;
		var prediction_line_to_enemy;
		var prediction_line_to_enemy_2;
		var prediction_line_to_enemy_3;
		var player_laser_sight;
		var enemies_laser_sight              = [];
		var remove_mouse_movement_old_value  = false;
		var remove_mouse_movement_update     = false;
		
		var auto_aim_enabled                 = true;


		// Functions
        var isset = function (n) {
            return void 0 !== n && null !== n && "" !== n;
        }
		
		var filter = function (obj, filter) {
			var key, keys = [];
			for (key in obj) {
				if (obj.hasOwnProperty(key) && filter.test(key)) {
					keys.push(key);
				}
			}
			return keys;
		}
		
		
		function player_old( player ) {
			
			var time_now = window.performance.now();
			
			if ( ! player.old_1 ) {
				player.old_1 = {};
				player.old_1['pos'] = player.pos;
				player.old_1['time'] = time_now;
			}
			
			if ( ! player.old_2 ) {
				player.old_2 = {};
				player.old_2['pos'] = player.pos;
				player.old_2['time'] = time_now;
			}

			if ( ! player.old_3 ) {
				player.old_3 = {};
				player.old_3['pos'] = player.pos;
				player.old_3['time'] = time_now;
			}
			
			if ( ! player.old_4 ) {
				player.old_4 = {};
				player.old_4['pos'] = player.pos;
				player.old_4['time'] = time_now;
			}
			
			if ( time_now - player.old_1['time'] > 100 ) {
				player.old_1['pos'] = player.pos;
				player.old_1['time'] = time_now;
			}
			
			if ( time_now - player.old_2['time'] > 120 ) {
				player.old_2['pos'] = player.pos;
				player.old_2['time'] = time_now;
			}
			
			if ( time_now - player.old_3['time'] > 140 ) {
				player.old_3['pos'] = player.pos;
				player.old_3['time'] = time_now;
			}

			if ( time_now - player.old_4['time'] > 160 ) {
				player.old_4['pos'] = player.pos;
				player.old_4['time'] = time_now;
			}

			var player_old_3 = JSON.stringify( player.old_3 );
			player.old_4 = JSON.parse( player_old_3 );

			var player_old_2 = JSON.stringify( player.old_2 );
			player.old_3 = JSON.parse( player_old_2 );

			var player_old_1 = JSON.stringify( player.old_1 );
			player.old_2 = JSON.parse( player_old_1 );

			player.old_1['pos'] = player.pos;
			player.old_1['time'] = time_now;

			return player;
		}
		
		function player_weapon_bullet_speed_and_distance( player ) {
			var player_weapon = _hacker[player_data_parent_key]['weapType'];
			var player_weapon_bullet_distance = 10;
			var player_weapon_bullet_speed = 0;
			
			var player_bullet_type = '';
			
			if ( guns[player_weapon] ) {
				if ( guns[player_weapon]['bulletType'] ) {
					player_bullet_type = guns[player_weapon]['bulletType'];
				}
			}
			
			if ( bullets[player_bullet_type] ) {
				if ( bullets[player_bullet_type]['distance'] ) {
					player_weapon_bullet_distance = bullets[player_bullet_type]['distance'];
				}
				if ( bullets[player_bullet_type]['speed'] ) {
					player_weapon_bullet_speed = bullets[player_bullet_type]['speed'];
				}
			}

			player['weapon_bullet_distance'] = player_weapon_bullet_distance;
			player['weapon_bullet_speed'] = player_weapon_bullet_speed;
			
			return player;
		}

		function player_position_difference( player ) {
			
			var time_now = window.performance.now();
			
			if ( ! player.time_difference ) {
				player.time_difference = 0;
			}
			
			if ( ! player.pos_x_difference ) {
				player.pos_x_difference = 0;
			}
			
			if ( ! player.pos_y_difference ) {
				player.pos_y_difference = 0;
			}
			
			var time_difference_old_2 = time_now - player['old_2']['time'];
			var pos_x_difference_old_2 = player['pos']['x'] - player['old_2']['pos']['x'];
			var pos_y_difference_old_2 = player['pos']['y'] - player['old_2']['pos']['y'];
			
			var time_difference_old_3 = time_now - player['old_3']['time'];
			var pos_x_difference_old_3 = player['pos']['x'] - player['old_3']['pos']['x'];
			var pos_y_difference_old_3 = player['pos']['y'] - player['old_3']['pos']['y'];
			
			var time_difference_old_4 = time_now - player['old_4']['time'];
			var pos_x_difference_old_4 = player['pos']['x'] - player['old_4']['pos']['x'];
			var pos_y_difference_old_4 = player['pos']['y'] - player['old_4']['pos']['y'];
			
			player.time_difference = ( time_difference_old_2 + time_difference_old_3 + time_difference_old_4 ) / 3;
			player.pos_x_difference = ( ( pos_x_difference_old_2 + pos_x_difference_old_3 + pos_x_difference_old_4 ) / 3 );
			player.pos_y_difference = ( ( pos_y_difference_old_2 + pos_y_difference_old_3 + pos_y_difference_old_4 ) / 3 );
			
			return player;
		}


		function player_prediction( player ) {
			
			

			var hacker_weapon_bullet_speed = 0;
			
			if ( _hacker[player_data_parent_key]['weapon_bullet_speed'] ) {
				hacker_weapon_bullet_speed = _hacker[player_data_parent_key]['weapon_bullet_speed'];
			}

			var enemy_distance_average = 0;
			
			if ( player['distance_average'] ) {
				enemy_distance_average = player['distance_average'];
			}
			
			var bullet_to_enemy_time = 0;
			
			if ( enemy_distance_average != 0 && hacker_weapon_bullet_speed != 0 ) {
				bullet_to_enemy_time = enemy_distance_average / hacker_weapon_bullet_speed * 1000;
			}

			if ( ! player.prediction ) {
				player.prediction = {};
				player.prediction.pos = {};
				player.prediction.pos.x = player['pos']['x'];
				player.prediction.pos.y = player['pos']['y'];
			}
			
			// var time_difference_old_2 = time_now - player['old_2']['time'];
			// var pos_x_difference_old_2 = player['pos']['x'] - player['old_2']['pos']['x'];
			// var pos_y_difference_old_2 = player['pos']['y'] - player['old_2']['pos']['y'];
			
			// var time_difference_old_3 = time_now - player['old_3']['time'];
			// var pos_x_difference_old_3 = player['pos']['x'] - player['old_3']['pos']['x'];
			// var pos_y_difference_old_3 = player['pos']['y'] - player['old_3']['pos']['y'];
			
			// var time_difference_old_4 = time_now - player['old_4']['time'];
			// var pos_x_difference_old_4 = player['pos']['x'] - player['old_4']['pos']['x'];
			// var pos_y_difference_old_4 = player['pos']['y'] - player['old_4']['pos']['y'];
			
			
			// var _hacker_time_difference_old_2 = time_now - _hacker[player_data_parent_key]['old_2']['time'];
			// var _hacker_pos_x_difference_old_2 = _hacker[player_data_parent_key]['pos']['x'] - _hacker[player_data_parent_key]['old_2']['pos']['x'];
			// var _hacker_pos_y_difference_old_2 = _hacker[player_data_parent_key]['pos']['y'] - _hacker[player_data_parent_key]['old_2']['pos']['y'];
			
			// var _hacker_time_difference_old_3 = time_now - _hacker[player_data_parent_key]['old_3']['time'];
			// var _hacker_pos_x_difference_old_3 = _hacker[player_data_parent_key]['pos']['x'] - _hacker[player_data_parent_key]['old_3']['pos']['x'];
			// var _hacker_pos_y_difference_old_3 = _hacker[player_data_parent_key]['pos']['y'] - _hacker[player_data_parent_key]['old_3']['pos']['y'];
			
			// var _hacker_time_difference_old_4 = time_now - _hacker[player_data_parent_key]['old_4']['time'];
			// var _hacker_pos_x_difference_old_4 = _hacker[player_data_parent_key]['pos']['x'] - _hacker[player_data_parent_key]['old_4']['pos']['x'];
			// var _hacker_pos_y_difference_old_4 = _hacker[player_data_parent_key]['pos']['y'] - _hacker[player_data_parent_key]['old_4']['pos']['y'];
			
			// player['time_difference'] = ( time_difference_old_2 + time_difference_old_3 + time_difference_old_4 ) / 3;
			// player['pos_x_difference'] = ( ( pos_x_difference_old_2 + pos_x_difference_old_3 + pos_x_difference_old_4 ) / 3 );
			// player['pos_y_difference'] = ( ( pos_y_difference_old_2 + pos_y_difference_old_3 + pos_y_difference_old_4 ) / 3 );

			player.prediction.pos.x = ( ( bullet_to_enemy_time * player.pos_x_difference ) / player.time_difference ) + player['pos']['x'];
			player.prediction.pos.y = ( ( bullet_to_enemy_time * player.pos_y_difference ) / player.time_difference ) + player['pos']['y'];

			return player;
		}
		
		
		function player_distance( player ) {

			var player_pos_difference_x = player.pos.x - _hacker[player_data_parent_key].pos.x;
			var player_pos_difference_y = player.pos.y - _hacker[player_data_parent_key].pos.y;

			player['distance_average'] = Math.sqrt( Math.pow( player_pos_difference_x, 2 ) + Math.pow( player_pos_difference_y, 2 ) );

			return player;
		}
		
		
		function player_moving( player ) {
			var moving = false;

			if ( JSON.stringify( player.old_2.pos ) != JSON.stringify( player.pos ) ) {
				moving = true;
			}

			if ( JSON.stringify( player.old_3.pos ) != JSON.stringify( player.pos ) ) {
				moving = true;
			}

			player['moving'] = moving;
		
			return player;
		}
		
		
		function get_new_pos(radians, radius) {
			var new_pos = {
				x: Math.cos(radians) * radius,
				y: Math.sin(radians) * radius
			};
			
			return new_pos;
		}
		
		var p_function = function (n, e, t) {
			return n.x * e.y + e.x * t.y + t.x * n.y - t.x * e.y - n.x * t.y - e.x * n.y
		}
		
		var c_function = function (n, e, t) {
			return 0 == n.x * e.y + e.x * t.y + t.x * n.y - t.x * e.y - n.x * t.y - e.x * n.y && Math.min([n.x, e.x]) <= t.x && t.x <= Math.max([n.x, e.x]) && Math.min([n.y, e.y]) <= t.y && t.y <= Math.max([n.y], e.y)
		}

		var l_function = function (n) {
			return !! function (n) {
				return c_function(n.A, n.B, n.C) || c_function(n.A, n.B, n.D) || c_function(n.C, n.D, n.A) || c_function(n.C, n.D, n.B)
			}(n) || !(p_function(n.A, n.B, n.C) * p_function(n.A, n.B, n.D) >= 0 || p_function(n.C, n.D, n.A) * p_function(n.C, n.D, n.B) >= 0)
		}

		var isNotCollideble = function ( enemy, objects, player ) {
			var collidableObjects = Object.keys(objects).filter(function (n) {
				return void 0 !== objects[n].collidable && objects[n].collidable && !objects[n].destructible;
			});
			
			var p = [];

			p.A = [];
			p.B = [];
			p.C = [];
			p.D = [];
			p.A.x = player.pos.x;
			p.A.y = player.pos.y;
			p.B.x = enemy.prediction.pos.x;
			p.B.y = enemy.prediction.pos.y;
			
			var d = true;
			
			collidableObjects.forEach(function (n, e, t) {
				var i;
				objects[n].layer !== player.layer || objects[n].dead || void 0 !== (i = objects[n]).img && i.img.indexOf("window") > -1 || (void 0 !== objects[n].collider && void 0 !== objects[n].collider.min && void 0 !== objects[n].collider.max ? (p.C.x = objects[n].collider.min.x, p.C.y = objects[n].collider.min.y, p.D.x = objects[n].collider.max.x, p.D.y = objects[n].collider.min.y, l_function(p) && (d = false), p.C.x = objects[n].collider.max.x, p.C.y = objects[n].collider.min.y, p.D.x = objects[n].collider.max.x, p.D.y = objects[n].collider.max.y, l_function(p) && (d = false), p.C.x = objects[n].collider.max.x, p.C.y = objects[n].collider.max.y, p.D.x = objects[n].collider.min.x, p.D.y = objects[n].collider.max.y, l_function(p) && (d = false), p.C.x = objects[n].collider.min.x, p.C.y = objects[n].collider.max.y, p.D.x = objects[n].collider.min.x, p.D.y = objects[n].collider.max.y, l_function(p) && (d = false)) : function (n, e, t, i, a, o) {
					var r, s, l = a - t,
						c = o - i,
						p = l * l + c * c,
						d = -1;
					0 != p && (d = ((n - t) * l + (e - i) * c) / p), d < 0 ? (r = t, s = i) : d > 1 ? (r = a, s = o) : (r = t + d * l, s = i + d * c);
					var u = n - r,
						m = e - s;
					return Math.sqrt(u * u + m * m)
				}(objects[n].collider.pos.x, objects[n].collider.pos.y, p.A.x, p.A.y, p.B.x, p.B.y) <= objects[n].collider.rad && (d = false))
			});

			return d;
		}
		
		
        function i() {
            this.container = new r.Container,
            this.container.visible = !1,
            this.timerBackground = r.Sprite.fromImage("timer-background.img"),
            this.timerBackground.anchor.set(.5, .5),
            this.timerBackground.scale.set(1, 1),
            this.container.addChild(this.timerBackground),
            this.gfx = new r.Graphics,
            this.container.addChild(this.gfx),
            this.counterText = new r.Text,
            this.counterText.anchor.set(.5, .5),
            this.counterText.style = {
                fontFamily: "Roboto Condensed, Arial, sans-serif",
                fontWeight: "bold",
                fontSize: s,
                align: "center",
                fill: 16777215,
                stroke: 0,
                strokeThickness: 3
            },
            this.container.addChild(this.counterText),
            this.labelText = new r.Text,
            this.labelText.anchor.set(.5, .5),
            this.labelText.style = {
                fontFamily: "Roboto Condensed, Arial, sans-serif",
                fontWeight: "100",
                fontSize: s,
                align: "center",
                fill: 16777215
            },
            this.container.addChild(this.labelText),
            this.screenScaleFactor = 1,
            this.mobileOffset = 0,
            this.active = !1,
            this.label = "",
            this.elapsed = 0,
            this.duration = 0
        }
        var r = a("8b1dfb45")
          , o = a("10899aea")
          , n = a("ce29f17f")
          , s = 24;
        i.prototype = {
            destroy: function() {
                this.container.removeChild(this.timerBackground),
                this.timerBackground.destroy({
                    children: !0
                }),
                this.container.destroy({
                    children: !0,
                    texture: !0
                })
            },
            start: function(e, t, a) {
                this.active = !0,
                this.label = e,
                this.elapsed = t,
                this.duration = a
            },
            stop: function() {
                this.active = !1
            },
            resize: function(e, t) {
                this.screenScaleFactor = t,
                n.uiLayout == n.UiLayout.Sm ? (n.tablet || this.container.scale.set(.5, .5),
                this.mobileOffset = n.isLandscape ? e.mobileOffsetLandscape : e.mobileOffsetPortrait) : (this.container.scale.set(1, 1),
                this.mobileOffset = 0)
            },
            update: function(e, t) {
				// Dynamic variables

				var players                          = _hacker[players_parent_key][players_child_key];
				
				var players_keys                     = Object.keys(players);

				var player_team_id                   = players[_hacker[player_id_key]].teamId;

				objects_visible                      = _hacker[objects_key].idToObj;
				
				var bOnMouseMove                     = _hacker[input_parent_key]['bOnMouseMove'];
				var bOnMouseMove_empty               = function (n) {}
				
				_hacker[player_data_parent_key]      = player_weapon_bullet_speed_and_distance( _hacker[player_data_parent_key] );
				_hacker[player_data_parent_key]      = player_old( _hacker[player_data_parent_key] );
				_hacker[player_data_parent_key]      = player_position_difference( _hacker[player_data_parent_key] );


				// map data: _hacker['Je']['mapData']['objects']
				
				//_hacker['debugZoom'] = '15';
	
				var players_visible                  = [];
				var enemies_visible                  = [];
				var player_teammates                 = [];
				var enemies                          = [];

				players_keys.forEach(function (key) {

					//If it is not me
					if ( key != _hacker[player_id_key] ) {

						//If enemy exist in all visible elements
						if ( objects_visible[key] ) {

							//If enemy is not dead
							if ( ! objects_visible[key][player_data_child_key].dead ) {

								//If enemy is not downed
								if ( ! objects_visible[key][player_data_child_key].downed ) {
									
									//Add to the list
									players_visible[key] = objects_visible[key];
								
									//If enemy is not in my team
									if ( players[key].teamId != player_team_id ) {

										//Add to the list
										enemies_visible[key] = objects_visible[key];
			
										enemies_visible[key] = player_old( enemies_visible[key] );
										enemies_visible[key] = player_distance( enemies_visible[key] );
										enemies_visible[key] = player_position_difference( enemies_visible[key] );
										enemies_visible[key] = player_prediction( enemies_visible[key] );

									}
								}
								
								//If current player is in my team
								if ( players[key].teamId == player_team_id ) {
									
									//Add to the list
									player_teammates[key] = objects_visible[key];
								}
							}
						}

						//If enemy is not in my team
						if ( players[key].teamId != player_team_id ) {
							enemies.push( key );
						}
					}
				} );
				
				// if ( auto_aim_enabled ) {
					// console.error( 'enabled' );
				// } else {
					// console.error( 'disabled' );
				// }

				// Auto AIM
				var screen_half_x = _hacker[screen_key].screenWidth / 2;
				var screen_half_y = _hacker[screen_key].screenHeight / 2;

				var enemy_position_closest = 9999999;
				var get_degree = 0;
				var new_pos = 0;
				
				var remove_mouse_movement_new_value = false;
	
				if ( enemies_visible.length < 1 || enemies_visible == undefined ){
					// empty
				} else {
					
					
					var hacker_layer = _hacker[player_data_parent_key]['layer'];
					var hacker_action = _hacker[player_data_parent_key]['action']['type'];
					var hacker_weapon_bullet_distance = _hacker[player_data_parent_key]['weapon_bullet_distance'];

					enemies_visible.forEach( function(current_user, index) {
						var emeny_layer = current_user['layer'];

						if (
							( hacker_layer == 0 && ( emeny_layer == 0 || emeny_layer == 2 || emeny_layer == 3 ) ) ||
							( hacker_layer == 1 && ( emeny_layer == 1 || emeny_layer == 2 || emeny_layer == 3 ) ) ||
							( hacker_layer == 2 && ( emeny_layer == 2 || emeny_layer == 3 || emeny_layer == 1 || emeny_layer == 0 ) ) ||
							( hacker_layer == 3 && ( emeny_layer == 3 || emeny_layer == 2 || emeny_layer == 1 || emeny_layer == 0 ) )
						) {
							var not_collidable = isNotCollideble( current_user, objects_visible, _hacker[player_data_parent_key] );
							
							enemies_visible[index]['line_color'] = 16756224;
							
							if ( not_collidable ) {
								var enemy_pos_difference_x = current_user.prediction.pos.x - _hacker[player_data_parent_key].pos.x - _hacker[player_data_parent_key].pos_x_difference;
								var enemy_pos_difference_y = current_user.prediction.pos.y - _hacker[player_data_parent_key].pos.y - _hacker[player_data_parent_key].pos_x_difference;

								var enemy_distance_average = 0;
								
								if ( current_user['distance_average'] ) {
									enemy_distance_average = current_user['distance_average'];
								}
								
								// No auto aim chicken ;D
								if ( current_user['nameText']['_text'] != 'chicken' ) {
									if ( hacker_weapon_bullet_distance > enemy_distance_average ) {
										if ( enemy_distance_average < enemy_position_closest ) {
											remove_mouse_movement_new_value = true;
		
											
											enemies_visible[index]['line_color'] = 16711680;

											enemy_position_closest = enemy_distance_average;
											get_degree = Math.atan2(enemy_pos_difference_x, enemy_pos_difference_y) - ( Math.PI / 2 );
											
											new_pos = get_new_pos( get_degree, 10 );

											_hacker[input_parent_key][input_child_key_mouse_pos]['x'] = ( screen_half_x + new_pos.x );
											_hacker[input_parent_key][input_child_key_mouse_pos]['y'] = ( screen_half_y + new_pos.y );

										}
									}
								}
							}
						} else {
							enemies_visible[index]['line_color'] = 2435840;
						}
					});
				}


				if ( remove_mouse_movement_old_value != remove_mouse_movement_new_value ) {
					remove_mouse_movement_old_value = remove_mouse_movement_new_value;
					
					remove_mouse_movement_update = true;
				} else {
					remove_mouse_movement_update = false;
				}
				
				
				if ( remove_mouse_movement_update ) {
					if ( remove_mouse_movement_new_value ) {
						window.removeEventListener("mousemove", bOnMouseMove);

						window.addEventListener("mousemove", bOnMouseMove_empty);
					} else {
						window.removeEventListener("mousemove", bOnMouseMove_empty);
						
						window.addEventListener("mousemove", bOnMouseMove);
					}
				}


				// Player laser sight
				// if ( player_laser_sight && player_laser_sight.graphicsData ) {
					// player_laser_sight.clear();
				// }
				
				// if (_hacker[player_data_parent_key].weapType) {
					// var current_weapon = guns[_hacker[player_data_parent_key].weapType];
					// var current_weapon_angle = 0;

					// if ( isset(current_weapon.shotSpread) && isset(current_weapon.bulletType) ) {
						// var current_user_moving = is_player_moving( _hacker[player_data_parent_key][player_data_child_key] );

						// if ( current_user_moving ) {
							// current_weapon_angle = .01745329252 * ( current_weapon.shotSpread + current_weapon.moveSpread ) / 2;
						// } else {
							// current_weapon_angle = .01745329252 * current_weapon.shotSpread / 2;
						// }

						// var current_weapon_range = bullets[current_weapon.bulletType].distance * _hacker[screen_key].ppu;
						// var current_weapon_direction = Math.atan2( _hacker[player_data_parent_key][player_data_child_key].dir.x, _hacker[player_data_parent_key][player_data_child_key].dir.y ) - Math.PI / 2;

						// if ( player_laser_sight && player_laser_sight.graphicsData ) {
							// _hacker[player_data_parent_key].container.addChild( player_laser_sight );
							// _hacker[player_data_parent_key].container.setChildIndex( player_laser_sight, 0 );
							
							// var l = current_weapon_direction - current_weapon_angle,
								// c = current_weapon_direction + current_weapon_angle;
								
							// l = l > 2 * Math.PI ? l - 2 * Math.PI : l < 0 ? l + 2 * Math.PI : l;

							// c = c > 2 * Math.PI ? c - 2 * Math.PI : c < 0 ? c + 2 * Math.PI : c;

							// player_laser_sight.beginFill(16777215, .35);

							// player_laser_sight.moveTo(0, 0);

							// player_laser_sight.arc(0, 0, current_weapon_range, l, c);

							// player_laser_sight.lineTo(0, 0);

							// player_laser_sight.endFill();
						// } else {
							// player_laser_sight = new window.PIXI.Graphics;
						// }
					// }
				// }

				// Enemies laser sight
				// if ( enemies_laser_sight ) {
					// enemies_laser_sight.forEach(function (n, k) {
						// if ( enemies_laser_sight[k].graphicsData ) {
							// enemies_laser_sight[k].clear();
						// }
					// });
				// }
				
				// players_visible.forEach(function (current_user, index) {
					// if (current_user.weapType) {
						// var current_weapon = guns[current_user.weapType];
						// var current_weapon_angle = 0;
						// var liser_sight_color;
						
						// if ( current_weapon.ammo == '9mm' ) {
							// liser_sight_color = 16756224;
						// } else if ( current_weapon.ammo == '762mm' ) {
							// liser_sight_color = 26367;
						// } else if ( current_weapon.ammo == '12gauge' ) {
							// liser_sight_color = 16711680;
						// } else if ( current_weapon.ammo == '556mm' ) {
							// liser_sight_color = 237056;
						// } else if ( current_weapon.ammo == '45acp' ) {
							// liser_sight_color = 7536811;
						// } else if ( current_weapon.ammo == '308sub' ) {
							// liser_sight_color = 2435840;
						// }
						
						// if ( isset(current_weapon.shotSpread) && isset(current_weapon.bulletType) ) {
							// var current_user_moving = is_player_moving( current_user[player_data_child_key] );

							// if ( current_user_moving ) {
								// current_weapon_angle = .01745329252 * ( current_weapon.shotSpread + current_weapon.moveSpread ) / 2;
							// } else {
								// current_weapon_angle = .01745329252 * current_weapon.shotSpread / 2;
							// }
							
							// var current_weapon_range = bullets[current_weapon.bulletType].distance * _hacker[screen_key].ppu;
							// var current_weapon_direction = Math.atan2( current_user[player_data_child_key].dir.x, current_user[player_data_child_key].dir.y ) - Math.PI / 2;

							// if ( enemies_laser_sight[index] && enemies_laser_sight[index].graphicsData ) {
								// current_user.container.addChild(enemies_laser_sight[index]);
								// current_user.container.setChildIndex(enemies_laser_sight[index], 0);

								// var l = current_weapon_direction - current_weapon_angle,
									// c = current_weapon_direction + current_weapon_angle;
									
								// l = l > 2 * Math.PI ? l - 2 * Math.PI : l < 0 ? l + 2 * Math.PI : l;

								// c = c > 2 * Math.PI ? c - 2 * Math.PI : c < 0 ? c + 2 * Math.PI : c;

								// enemies_laser_sight[index].beginFill(liser_sight_color, .35);

								// enemies_laser_sight[index].moveTo(0, 0);

								// enemies_laser_sight[index].arc(0, 0, current_weapon_range, l, c);

								// enemies_laser_sight[index].lineTo(0, 0);

								// enemies_laser_sight[index].endFill();
							// } else {
							
								// enemies_laser_sight[index] = new window.PIXI.Graphics;
							// }
						// }
					// }
				// });
				
				
				// Draw lines to enemies
				if ( player_lines_to_enemies && player_lines_to_enemies.graphicsData ) {
					player_lines_to_enemies.clear();
				}	
				
				if (_hacker[player_data_parent_key] && _hacker[player_data_parent_key].container) {
					if ( enemies_visible && enemies_visible.length > 0 ) {

						if ( player_lines_to_enemies && player_lines_to_enemies.graphicsData ) {
							player_lines_to_enemies.beginFill();

							enemies_visible.forEach(function (current_user) {
								var enemy_position_x = ( current_user.pos.x - _hacker[player_data_parent_key].pos.x ) * _hacker[screen_key].ppu;
								var enemy_position_y = ( _hacker[player_data_parent_key].pos.y - current_user.pos.y ) * _hacker[screen_key].ppu;

								player_lines_to_enemies.lineStyle( 4, current_user['line_color'] );

								player_lines_to_enemies.moveTo( 0, 0 );
								player_lines_to_enemies.lineTo( enemy_position_x, enemy_position_y );
							});
							
							player_lines_to_enemies.endFill();
						} else {
							player_lines_to_enemies = new window.PIXI.Graphics;

							_hacker[player_data_parent_key].container.addChild( player_lines_to_enemies );
							_hacker[player_data_parent_key].container.setChildIndex( player_lines_to_enemies, 0 );
						}
					}
				}
				
				
				
	
				// Prediction line to enemy
				// if ( prediction_line_to_enemy && prediction_line_to_enemy.graphicsData ) {
					// prediction_line_to_enemy.clear();
				// }	
				
				// if (_hacker[player_data_parent_key] && _hacker[player_data_parent_key].container) {
					// if ( enemies_visible && enemies_visible.length > 0 ) {

						// if ( prediction_line_to_enemy && prediction_line_to_enemy.graphicsData ) {
							// prediction_line_to_enemy.beginFill();

							// enemies_visible.forEach( function(current_user) {

								// var enemy_prediction_x = ( current_user.prediction.pos.x - _hacker[player_data_parent_key].pos.x - _hacker[player_data_parent_key].pos_x_difference ) * _hacker[screen_key].ppu;
								// var enemy_prediction_y = ( _hacker[player_data_parent_key].pos.y - current_user.prediction.pos.y + _hacker[player_data_parent_key].pos_y_difference ) * _hacker[screen_key].ppu;
								
								// prediction_line_to_enemy.lineStyle( 3, 0 );

								// prediction_line_to_enemy.moveTo( 0, 0 );
								// prediction_line_to_enemy.lineTo( enemy_prediction_x, enemy_prediction_y );
							// });
							
							// prediction_line_to_enemy.endFill();
						// } else {
							// prediction_line_to_enemy = new window.PIXI.Graphics;

							// _hacker[player_data_parent_key].container.addChild( prediction_line_to_enemy );
							// _hacker[player_data_parent_key].container.setChildIndex( prediction_line_to_enemy, 0 );
						// }
					// }
				// }
				
				
				// Prediction line to enemy V. 2
				// if ( prediction_line_to_enemy_2 && prediction_line_to_enemy_2.graphicsData ) {
					// prediction_line_to_enemy_2.clear();
				// }	
				
				// if (_hacker[player_data_parent_key] && _hacker[player_data_parent_key].container) {
					// if ( enemies_visible && enemies_visible.length > 0 ) {

						// if ( prediction_line_to_enemy_2 && prediction_line_to_enemy_2.graphicsData ) {
							// prediction_line_to_enemy_2.beginFill();

							// enemies_visible.forEach( function(current_user) {

								// var enemy_prediction_x = ( current_user.prediction_2.pos.x - _hacker[player_data_parent_key].pos.x ) * _hacker[screen_key].ppu;
								// var enemy_prediction_y = ( _hacker[player_data_parent_key].pos.y - current_user.prediction_2.pos.y ) * _hacker[screen_key].ppu;
								
								// prediction_line_to_enemy_2.lineStyle( 3, 16711680 );

								// prediction_line_to_enemy_2.moveTo( 0, 0 );
								// prediction_line_to_enemy_2.lineTo( enemy_prediction_x, enemy_prediction_y );
							// });
							
							// prediction_line_to_enemy_2.endFill();
						// } else {
							// prediction_line_to_enemy_2 = new window.PIXI.Graphics;

							// _hacker[player_data_parent_key].container.addChild( prediction_line_to_enemy_2 );
							// _hacker[player_data_parent_key].container.setChildIndex( prediction_line_to_enemy_2, 0 );
						// }
					// }
				// }
	
	
				// Prediction line to enemy V. 3
				// if ( prediction_line_to_enemy_3 && prediction_line_to_enemy_3.graphicsData ) {
					// prediction_line_to_enemy_3.clear();
				// }	
				
				// if (_hacker[player_data_parent_key] && _hacker[player_data_parent_key].container) {
					// if ( enemies_visible && enemies_visible.length > 0 ) {

						// if ( prediction_line_to_enemy_3 && prediction_line_to_enemy_3.graphicsData ) {
							// prediction_line_to_enemy_3.beginFill();

							// enemies_visible.forEach( function(current_user) {

								// var enemy_prediction_x = ( current_user.prediction_3.pos.x - _hacker[player_data_parent_key].pos.x ) * _hacker[screen_key].ppu;
								// var enemy_prediction_y = ( _hacker[player_data_parent_key].pos.y - current_user.prediction_3.pos.y ) * _hacker[screen_key].ppu;
								
								// prediction_line_to_enemy_3.lineStyle( 3, 16777215 );

								// prediction_line_to_enemy_3.moveTo( 0, 0 );
								// prediction_line_to_enemy_3.lineTo( enemy_prediction_x, enemy_prediction_y );
							// });
							
							// prediction_line_to_enemy_3.endFill();
						// } else {
							// prediction_line_to_enemy_3 = new window.PIXI.Graphics;

							// _hacker[player_data_parent_key].container.addChild( prediction_line_to_enemy_3 );
							// _hacker[player_data_parent_key].container.setChildIndex( prediction_line_to_enemy_3, 0 );
						// }
					// }
				// }
	
				// Change nametext size for teammates AND 
				// Remove hack text that is showing for teammates (sometimes)
				player_teammates.forEach(function (player_current, player_current_id) {
					player_current.nameText.style.fontSize = 60;

					// Remove old text if is present
					if ( isset( player_current['hack_text'] ) ) {
						player_current.container.removeChild( player_current['hack_text'] );

						delete player_current.hack_text;
					}
				});

				// Add hack text to all enemies (Level 1-6 and gun name)
				enemies_visible.forEach(function (player_current, player_current_id) {
					player_current.nameText.visible = true;
					player_current.nameText.style.fontSize = 60;
					//console.error( player_current.pos.x );
					//player_current.nameText._text = player_current['pos']['x'];
					
					var chest_current = player_current[player_data_child_key].chest;
					var helmet_current = player_current[player_data_child_key].helmet;
					var weapon_current = player_current[player_data_child_key].curWeapType;
		
					var hack_text_update;

					if ( isset( player_current['hack_text_update'] ) ) {
						hack_text_update = false;
					} else {
						
						// Try once
						hack_text_update = true;
					}
					
					var chest_previous = '';

					if ( isset( player_current['chest_previous'] ) ) {
						chest_previous = player_current['chest_previous'];
					}

					if ( chest_current != chest_previous ) {
						hack_text_update = true;
					}
					
					var helmet_previous = '';

					if ( isset( player_current['helmet_previous'] ) ) {
						helmet_previous = player_current['helmet_previous'];
					}

					if ( helmet_current != helmet_previous ) {
						hack_text_update = true;
					}
					
					var weapon_previous = '';

					if ( isset( player_current['weapon_previous'] ) ) {
						if ( weapon_current != player_current['weapon_previous'] ) {
							hack_text_update = true;
						}
					}

					if ( hack_text_update ) {
						var chest_int = 0;

						if ('' != chest_current) {
							chest_int = parseInt(chest_current.substring(6, 7));
						}

						var helmet_int = 0;

						if ('' != helmet_current) {
							helmet_int = parseInt(helmet_current.substring(7, 8));
						}
						
						var total_level = chest_int + helmet_int;

						var enemy_name = 'Lvl: ' + total_level + ', ' + weapon_current;

						var hack_text_color = '#7300AB';

						if ( total_level > 5 ) {
							hack_text_color = '#252B00';
						} else if ( total_level > 4 ) {
							hack_text_color = '#FF0000';
						} else if ( total_level > 3 ) {
							hack_text_color = '#FFAE00';
						} else if ( total_level > 2 ) {
							hack_text_color = '#039E00';
						} else if ( total_level > 1 ) {
							hack_text_color = '#0066FF';
						}

						var hack_text = new PIXI.Text( enemy_name, { fill: hack_text_color, fontWeight: 'bold', stroke: '#ffffff', strokeThickness: 5, fontSize: 36 });
						hack_text.anchor.set(0.5);
						hack_text.position.x = 0;
						hack_text.position.y = -40;

						// Remove old hack text if is present
						if ( isset( player_current['hack_text'] ) ) {
							player_current.container.removeChild( player_current['hack_text'] );
						}
						
						player_current.container.addChild( hack_text );
						
						player_current['hack_text'] = hack_text;
						
						player_current['hack_text_update'] = false;
					}
					
					player_current['chest_previous'] = player_current[player_data_child_key].chest;
					player_current['helmet_previous'] = player_current[player_data_child_key].helmet;
					player_current['weapon_previous'] = player_current[player_data_child_key].curWeapType;
				});
				
				
				
				
                if (!this.active)
                    return void (this.container.visible = !1);
                this.elapsed = o.min(this.elapsed + e, this.duration);
                var a = 56 + this.label.length * s * .45
                  , i = 1.5 * s
                  , r = 0 - a / 2
                  , n = 87.5 - i / 2
                  , l = o.min(this.elapsed / this.duration, 1) * Math.PI * 2 - .5 * Math.PI;
                this.gfx.clear(),
                this.gfx.beginFill(0, .5),
                this.gfx.drawRoundedRect(r, n, a, i, 5),
                this.gfx.endFill(),
                this.gfx.lineStyle(6, 16777215),
                this.gfx.arc(0, 0, 35, .5 * -Math.PI, l, !1),
                this.counterText.text = o.max(0, this.duration - this.elapsed).toFixed(1),
                this.labelText.position.y = 87.5,
                this.labelText.text = this.label,
                this.container.position.set(t.screenWidth / 2, t.screenHeight / 3 * this.screenScaleFactor + this.mobileOffset),
                this.container.visible = !0
            }
        },
        e.exports = {
            J: i
        }
		
		
		var call_later_a = true;

		setInterval(function () {
			// console.error( window.performance.now() );
			// console.error( _hacker );
			// console.error( _hacker[player_data_parent_key]['action'] );
			// console.error( a("0ae5a1da") );
			// console.error( objects_visible );
			// console.error( structures );
			//console.error( guns );


			// Emote variable
			// console.error( a("e5d16b4d") );
			
			
			// console.error( a("aaf70d05") );
			
			if ( _hacker && call_later_a ) {
				call_later_a = false;
				call_later();
			}
		}, 1000);
	
	


	
		
		// New Cursor
		document.querySelector("#game-area-wrapper").style.cursor = 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAQAAADZc7J/AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JQAAgIMAAPn/AACA6QAAdTAAAOpgAAA6mAAAF2+SX8VGAAAAAmJLR0QA/4ePzL8AAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfiDBAFFDub31YtAAACvUlEQVRIx7WVz0tUURTHP3d6poI2j3CpaYsWQVPRIk2KWg24iGAEw3JWbZtFIP4P/QdiroNcTO2CFJwoxH4wuKtF4JhhqUOvcHDmvXPfOy0kG803Y1Rn9bj3nO/lne/3fA80jkkmGyc4DW8NxwGDxqcciS11OcUFrnOMNdoJ8OMSf48WLpDhmtPX0VlthXa/smVLFMhTRGgap5lq2TwbjstjKQZpSUsxeCzjcjZs2WSK042LE2R4fyac9jetRqpRNGyHbRSparRpp/0zIe/JkIgvv+OUs0FJVFUlWpHZoN/229lgxUqoqlqSbOCUuRMHMeyU7/kVqyphoXZbeqXNM1VTbfN6ZUwKNQlVK/ae75QZPvjf32WDLavq2YlaskqBuwzwlKcMcJdCsjpR86zqls0GvPu9Fw5TKbssqp7NBonP5EgChkc8wgBJconP2cCzqsuSskztV9CAs/HAV7XhRM2scWP3fJTR3e8bZm2iZkPVB76zwcBegPvnwg2rOl9zt8nFspRzq/O+6oY9F3K//sJlcVw0suGYMI8bC+AyPyY21GhcWNzJ2yGkxzk5COZT9ALyfNstMHTRVafWb+Rf8inCDOKcpGcHwADdHZ19Ch90vcKbuhdHmGOOkbqTt18qHxT66OikGzCGSVx6WvuvRkk+mteiBSo84SHQxbOR8zCzRJoyMEqGDnP14tETfNfnCf8Vq3ixsjx8GGDI3S4GqnNBm7eHnpssscTNupNLbd5coFoUd5shdqc55aznRbUkvbKHxP1NhFyflKxqXpx1Ur9YWLXLC6DdiSuQqaNRKVOu8yOXzGW6DbqAXWb1HwopXsq3Divlvx6mpuPsNhlnaGYofjND2W9p4Yr9U0v7a1P92Ytfti5pSUtRGtn6f1gsP4FdUgyxwAJDpHAPfOoQMDPMNC5tvJ2Vr9BoN8MPZ/EGbt3AhqYAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTgtMTItMTZUMDU6MjA6NTktMDU6MDB/YrSVAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE4LTEyLTE2VDA1OjIwOjU5LTA1OjAwDj8MKQAAAABJRU5ErkJggg==) 16 16, auto';
		

		
		// Player hit new sound
		audio.Sounds.hits.player_bullet_hit_01.path = 'audio/hits/pan_bullet_hit_01.mp3';

		// Make 9mm bullets yellow
		game_settings.tracerColors["9mm"].regular = 16756224;
		game_settings.tracerColors["9mm"].saturated = 16756224;
		game_settings.tracerColors["9mm"].alphaRate = 1;
		game_settings.tracerColors["9mm"].alphaMin = 1;

		// Make 7.62mm bullets blue
		game_settings.tracerColors["762mm"].regular = 26367;
		game_settings.tracerColors["762mm"].saturated = 26367;
		game_settings.tracerColors["762mm"].alphaRate = 1;
		game_settings.tracerColors["762mm"].alphaMin = 1;

		// Make 12gauge bullets red
		game_settings.tracerColors["12gauge"].regular = 16711680;
		game_settings.tracerColors["12gauge"].saturated = 16711680;
		game_settings.tracerColors["12gauge"].alphaRate = 1;
		game_settings.tracerColors["12gauge"].alphaMin = 1;

		// Make 556mm bullets from green to white
		game_settings.tracerColors["556mm"].regular = 16777215;
		game_settings.tracerColors["556mm"].saturated = 16777215;
		game_settings.tracerColors["556mm"].alphaRate = 1;
		game_settings.tracerColors["556mm"].alphaMin = 1;
		
		// Make .45 ACP purple
		game_settings.tracerColors["45acp"].regular = 7536811;
		game_settings.tracerColors["45acp"].saturated = 7536811;
		game_settings.tracerColors["45acp"].alphaRate = 1;
		game_settings.tracerColors["45acp"].alphaMin = 1;
		
		// Make 308 Subsonic more visible	
		game_settings.tracerColors["308sub"].regular = 2435840;
		game_settings.tracerColors["308sub"].saturated = 4608e3;
		game_settings.tracerColors["308sub"].alphaRate = 1;
		game_settings.tracerColors["308sub"].alphaMin = 1;

		// Make zoom scopes bigger
		consumables["2xscope"].lootImg.scale = 0.25;
		consumables["4xscope"].lootImg.scale = 0.3;
		consumables["8xscope"].lootImg.scale = 0.35;
		consumables["15xscope"].lootImg.scale = 0.4;
		
		// Make backpages bigger
		consumables["backpack01"].lootImg.scale = 0.25;
		consumables["backpack02"].lootImg.scale = 0.3;
		consumables["backpack03"].lootImg.scale = 0.35;
		
		// Make chests bigger
		consumables["chest01"].lootImg.scale = 0.25;
		consumables["chest02"].lootImg.scale = 0.3;
		consumables["chest03"].lootImg.scale = 0.35;
		
		// Make helmets bigger
		consumables["helmet01"].lootImg.scale = 0.25;
		consumables["helmet02"].lootImg.scale = 0.3;
		consumables["helmet03"].lootImg.scale = 0.35;
		consumables["helmet03_forest"].lootImg.scale = 0.4;
		consumables["helmet03_leader"].lootImg.scale = 0.4;
		consumables["helmet03_lt"].lootImg.scale = 0.4;
		consumables["helmet03_lt_aged"].lootImg.scale = 0.4;
		consumables["helmet03_moon"].lootImg.scale = 0.4;
		consumables["helmet03_potato"].lootImg.scale = 0.4;
		consumables["helmet04_leader"].lootImg.scale = 0.4;
		consumables["helmet04_medic"].lootImg.scale = 0.4;

		// Make flare ammunition size 0.3
		consumables["flare"].lootImg.scale = 0.30;
		
		// Make AWC ammunition size 0.3
		consumables["308sub"].lootImg.scale = 0.30;
		
		// Make flare gun size to 0.4
		guns["flare_gun"].lootImg.scale = 0.4;
		guns["flare_gun_dual"].lootImg.scale = 0.4;
		
		// Make guns size increase size 0.4
		guns["m4a1"].lootImg.scale = 0.4;
		guns["an94"].lootImg.scale = 0.4;
		guns["mosin"].lootImg.scale = 0.4;
		guns["bar"].lootImg.scale = 0.4;
		guns["ots38"].lootImg.scale = 0.4;
		guns["ots38_dual"].lootImg.scale = 0.4;
		guns["qbb97"].lootImg.scale = 0.4;
		guns["scar"].lootImg.scale = 0.4;
		guns["sv98"].lootImg.scale = 0.4;
		guns["scorpion"].lootImg.scale = 0.4;
		guns["vector"].lootImg.scale = 0.4;
		guns["vector45"].lootImg.scale = 0.4;
		guns["mk12"].lootImg.scale = 0.4;
		guns["m39"].lootImg.scale = 0.4;
		
		// Make guns size increase size 0.5
		guns["deagle"].lootImg.scale = 0.5;
		guns["deagle_dual"].lootImg.scale = 0.5;
		guns["garand"].lootImg.scale = 0.5;
		guns["awc"].lootImg.scale = 0.5;
		guns["m249"].lootImg.scale = 0.5;
		guns["pkp"].lootImg.scale = 0.5;
		
		// Make skins size increase size 0.4
		skins["outfitDarkGhillie"].lootImg.scale = 0.4;
		skins["outfitDesertGhillie"].lootImg.scale = 0.4;
		skins["outfitGhillie"].lootImg.scale = 0.4;
		skins["outfitSpringGhillie"].lootImg.scale = 0.4;
		
		// Bullets increase width
		Object.keys(bullets).forEach(function (index) {
			bullets[index].tracerWidth += 0.1;
		});

		////////////////// Hidden Crates

		// Make crate stone green
		structures.stone_02.img.tint = 16777215;
		structures.stone_02.img.scale = 0.8;
		structures.stone_02.img.sprite = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAMAAABiM0N1AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAByUExURUdwTAZuAAWDAAeOAAhbAABgAAAyAAB4AHf/bgFAAAE+AAJkAAAaAANxAAA4AACIAABNAFb/VgFsAIj/iABpAlL/UgBzAAF9AAB4ASv/JwLVAADxAACMAAD9AADHAC3/DhLjAACkAACYAAC2AFj/KgCvAHW7yqsAAAARdFJOUwAEcUkLtTHi/CATWkSQnqB89I6kaAAAA5RJREFUWMOtmOuSqyAMgNcLsGhtq6uCWq9t3/8VjwR0abWg7skvpzP9JneSfH2ZxQ8CijGmlAbO10HxqedGCBElKHI96u+mBPiKCE9ehZOzi/ewHOqid8gkBIXBVgyOSC7/lYJMHwqVI3cTikZkouTs9mzKsqu6snkOLJlgOQqtBvoumSi3pmofWRaDZNmjrZqBTagLtahzAaPS5NbUhWL8Spa1zS2RKHIypQNGClMuKYpVVH0OKOZ+Nu8EZqUjJjZIVt2AlF8/kJxQcNL8+UmbWYoGlPpAckImOKy0YUApBiTX+WRXyuoNnJFUg3k8XHI84NzaeKO0gyARbxEv4AxFvFkKIKG3fPLP+/QBncC66NVNbg7+Mf7x+/vth1p4nHsLw/LOSPkB0WlZI9IJBe+G3Q3xUhhAaW7qU5EDWsS4cFCxifOCqkVlktnfvqiwvNrK0UjZ/UWlk1Cof2zm/Pz8Rk74e/KSc7EotOC8q6TymxKRinsU0ki16O1n/zeHyj0K6SqJwBE8xT5lxS6FNC+VIpfc2bI+26WQBiqEu8E2zPdbpoGkbSKVXBGz+jAoLlXBOZHZResgrU4gu12Z1iYXrTtbLzjhpLGZBMhSr7HZsjgbZHJD0BoT6NuokEzu0dt4fDvSztzRTApJb48g0UKSKt5Fem2VncxtAcotoLk/rugTx5V4l07QQ6ygD71WgXIAhdycj8b2fxS0LrUEbXG2WcBHHrxEppq1SymjRv8PiG7IbNtgApkdyFrr/wKCWvPhDTE+jtapBKp/bGxX0Y/av0UfmnYoPrrjljWiQ+Kp+T8PO0n27EC9/MZeaxm3VINU3f+wbVn5+2Zj8ocEKG7pPNjAU8sPxk2U/jxHirgddPdj0MfIwDZofZYOpsh5kwCVhuKgh7S5FlRK9lcu1Os0HclpVLxJeZftDT3MoljfjKLEPrAvq4yliw2JIlghdpHkgoSCtaWGVZuty0CfV8P0da18bOR0bH3NmhfRvt2iVHGHZZSEhtWYNdad9tHJ9Zic1rdjT5JGlEmrrOgGubCv2DWfD7hC9d06Szsh5GfDMcIPp4NGwvqyLuaLhkBkRds1A1dHDWK5tNCrutSk2o1FHFnuz4Hx+czCL9ix346mo4+6+qTzx3T4IRdv0zmKhmhmLYWTaPtVy6fhhfAlLCco8nZe7RyKw+tZnOoY55wRgs6RG2L/2O3PDyjF3unkYUoDM+MfyNcbNb1z91QAAAAASUVORK5CYII=';
		
		// Make crate barrel green
		structures.barrel_01b.img.tint = 16777215;
		structures.barrel_01b.img.scale = 0.8;
		structures.barrel_01b.img.sprite = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAMAAABiM0N1AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAABgUExURUdwTAZuAAWDAAhbAAB/AAE+AAA1AABgAAJkAAB4AANxAAE5AAeOAABNAAGLAACIAABzAAD9AADHAADxAALVABLjAAB4AQBQAAJ7AACCAACMAACkAAC3AACvAABiAACYAGffngQAAAAQdFJOUwAEcQv+EzK1WuKQHkl81KDqu73fAAADZ0lEQVRYw71Y6ZriIBBUc5FEZ7NcQyBx3v8tNzSQILnA8dv+OaNl9UlXXy4Hdi3aEqHbZAiVbXG9vGVZiZqqrnMhOBcir+uqQWWWjvKoat4FxuvqkYRVoCrvdiyvUBEPI+bvibwHy70/VSiG1fXuYHgv1YApY4QwRvGgZM8d1P008G1Tmw/3CjPy98UIw6o3/62b9hinrOBHuRxCFIc1SPOJqjxyCxk6E8zfXZugDCm06971BjhCeTBkNg9KQRTr2w5SdoOcS0xmEEYptkYpm8EIBlL5LdvmA7/zQ92nF5AFzEHRH+C+xekKfLgiDgZvmoMiigOnNRLEmY/kEMaDIiOHiK/yHosTIgVVUFTaZ+sXwyfGrHf6O9VL510bPuMc0/FJARJv/DDdtWOSxeI4JKaroL4Hjgkcj+OQsHh1DmnHRlMgONJMuY3aOfRCyDg2x3lQasDnEQfnZkqaEDeOOZj+OVl/DAXODdN3haWUASHiOTbwbzA+nDpHgJLpuXLqDT74hOS3NRlHKTdV+dDzkPmEOgfUnVNiemY+5lBDLTpC49MBPcdTSlCVEG7dZSbULvXDAjSclwDmtuN0zsAzMqeeOyB+UgLE+gal1OhpRl56VVlKTxXRvUTPuMYmfwyKWgLSU0aV92gKoP0KQwScenjZooB0kL5aiLWgfohsoIaYjtMhoaLr6vZyz8NYp5iLdn6/oM8AoQuaiPXkN0Ckh77Vr5kkMZN6N/9Sv3CfA/qYax8L9u/TT3NIf7tTkAlApiCLqUU6nPSABC0yTABfxXbTJgHZpt0aI2lJs2NkY7ClJw0G23rUpnk2j9r18E/zbB7+6+coidDyHG08kAmEIPl2bVs/2QmE/Ccb+vYNSqslYnOtiZsgwVoDlOwGyZJwIGViWZGzZfWLDZNZ2MzqlwVbtqSpyyiV4ab95nqsu4w/rnsL+zmSt2YHC3sgIVjU4r8pIT4nakKZxfZkFjuTWU74OR1KtlhRJyKZ6vZwPCm6SGpfRGot6v5zKEUXcTwyXxszMF8ds1GcyWwn1zHZl+tWGR/hvB4QdlV/xAFBV6Y9aXCpKAlPGoQqA9PVTRF/ZBFSjVirfW2M4vFHivgjS3D24aK3Jrh39in+7yHKncby9WksTzyNGVrl7U9wrLuVb17+Us6H/wBQihezQWa3TwAAAABJRU5ErkJggg==';
		
		// Make crate tree green
		structures.tree_03.img.tint = 65280;
		
		
		/////////////////// Other structures
		
		// Make barrel red
		structures.barrel_01.img.scale = 0.8;
		structures.barrel_01.img.sprite = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAMAAABiM0N1AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAABdUExURUdwTHsIAHADAG8DAEYAADQAAHMEAF4AAGACAHgAAD8BAIwIAD4BAIwBAIcBAHMAAMcAAPoJAPEAANYCAIEAAOYLAHYAAVAAAHwBAIwAAKQAALcAAK8AAGIAAJgAAEoV5cMAAAAPdFJOUwBxC5ATMgS1WuIeSXzUoMi11dsAAANgSURBVFjDvZjrmuIgDIa1R1qdleE0QOvc/2VuCdAiPYHrs/k5o69fQgJJLpcDa6q+Rug6GUJ1XzWXt6yoUdl2HZNSCClZ17Ulqot8yr3txCMy0bX3LFaFWvbYMdaiKh0j5+9J5iz4U4tSVDU3jxFM6QFTzgnhnOJBKyY86nYa+L7snAsac/L9YoRj7Vzuyv6YU7fwo0INMcWzBmU/0dZHbiErZ8J879qEsqLQrnvNFThSBxgyW4DSEMXuukMqrhAAhckM4ZRiZ5TyGUYwiGLXYlsP/M4v9Z9eIAvMo+gvaN/S1IAeoYnH4E3zKKIFaFqTIM5iJIeYAEVGARFfnXsqJyZFWVC1xmfnF8cnxp135jvtS+U1pZg5x3JCUUASZRimm3FM8VSOJ3GTBd0tckzidI4nYfnqHDKOjTZBcKLZdBuNc+hFkHVsjvOg9YDPIw7OzZKMIGEd8xj2nIwdo8C5YfqudJIKEEQCxwbxAyaGU+cISLI1V0+1IYZQkPpxptIkMZuVd1M0PBT08KDHuSRuSvQ+hxpy0Qsanx70HE8lQVZCuE2V2VD7ox8W0HCeAli4ijNnBp6R+eiFB4mTFCDON0il0txm5KVWtZP01AnVS8wdV7rDH6OkVkB6qqT0Hm0C9F9xiEATg5ctCWSC9NVDrCUNQ+QCNaRUnAkJnSq36y83Fsc6x3y02e2CPgNCFzQJY+RfQIRB3ZrXTJGUm3r3/JV54T4H+phrHwv2vx8/tcff7yRkBsgmZDWVyANnPSBRiQwT4KvaLtoskCvarWsk79DcNbJxseUfGlxs66s2z7P5ql1f/nmezZf/+jnKErQ8RxsPZIYgOHzXtq2f7AxB4ZMNdfuGpFUTsdnWpN0gUVsDklwHybM4cGRyaZGLpfVLDZNt2GzrV0RdtqK5zShVcaf9Zntsqkzcm72G/ZwUtNlRwx6NEDyp8d8cIT431MRjFt8bs/jZmOUHPz+Hki1V1A+RXD/2OMEouozU4RBpZlH/n8NRdBmORx7OxhwsnI75KM/GbD+uY7I/rrvJ+IjzukDYnfoTFggmM91KQyhNSbzSIFRbzKMrq/Qli1R6xGbaN8YpHn+VTF+yRGsfsax9RLD2qf7vIsqvxth6NcYyV2NWVn39Ey3rrvWbm7+c9eFfqQcFQ/gChC4AAAAASUVORK5CYII=';
		
		// Make stone use compressed image
		structures.stone_01.img.scale = 0.8;
		structures.stone_01.img.sprite = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAMAAABiM0N1AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAABvUExURUdwTDU8K0FDNBUSDjAgEyAhIDAsHzAwL8LBvxUTDiIlGhESDgoHBSwuJA8QDgkHBDo7OhIYErS0tMzMzCspJyUnKbKysjExMS0tLZ2cnG9ubH5+fkdHR1VVVT09PoOHg2RkZJiSi315cjY2Nq2kmlUP5y8AAAASdFJOUwBxSRMLtQTi/CBaNUSQniygfDGvGAoAAAOHSURBVFjDrZjpsqsgDICPC3LQWlurgFvd+v7PeEtwa1VAz80vpzP9JjtJfn7U4joOiYKIEOJ4PyfFJbYVIoQHQaFlE/cwxQnuCLPkUxi+WtERlkcs9A0ZBSPfMcUEIebyXynI+DGgOLKMUCTEI4WzZ9XkeVd0eVOVLBlhHPlaA10Lj5RnU7QvSmMQSl9t0ZRsRN2IRp0bGJUmz6bOBsYslLbNM5EofFGlQ4AGTL6mDKysqDigmLVv3gXMSt+YeF8oLZ5A4vcdkucLTsqrPW0myRpQaofk+SJ1UpbrMEKrggHJ8vbsSvvagPMm1WAe89ccGzjPNjaUthQkbH9zIuCUWWwsGZDQVz6512P6gE5gXfjpJouDf5R//P39+qEWHmcfxgXCMN4pKQ+QJY02Ip2Q821YpYjXgAHUl5u4tYgYEw7KjDgfqFpUJp787YoK44UpZ0Gi1YdKF6FQ+TLmPB5z5IS/Ry95N41CK863SkN+E3xUoQWpFgV6deccyo8otFRJBA5HY+zTPjuk0MJLucgla7JMkUMPNSjr08G2gB23bAECd0MqWSJm9WlQnA8F54VqF22DFnUC2W3JtE5LGh9z9rLghJPezcRBmnqN1ZbJBHgnNwStUYF+lQpN3oagdeqOplJIevsNEi0kKeJDpM9W2QlQACCuAU39cUOfOC7Eu3SBHqIF7fTaAcQBJN5XXpu9G2vISdC21BJk4my1gI9seIlUNauXXEaN/B8QMchs3WACme3IWiv/AoJac+ENUT6O2qkEqv/d2O5iTGv/Fn1o2r746M5b1ogOGRg0f52U0tdDi+xPOwkebTltie5/2jaaz2825PbZBMie6TTYwFN7Nm6i9Kc5UsTtpLtf5XKMdHSD1r50MEVOmwSoVGYnPbSYa0Gl5HjlQr2O09E8jfKOHg09zKLBcjMKE/3Avq4ylq42JIJghThEkgsScraWmr4wto7WPaxH0fa6xvKXIadj22vWvIi2JkplckPGvmI17hvtTvvq5HqML9vbsS1Jb5RKK5p1pVzYN+yazgdMoljVbbMWJwR+VRwjXH88aCSszOtsumgIBM3abj5qYM2lhdyHS026uLHAkaUq+/nMwm6Rp78djUef4eqTTh/j4QffbKNzFPHRxFoLw2Hgmp/X/BtmaxjHKLQPXu08Evj3qzjVMSEYo2to+ZF77vbnOoRE9uViB4Q4asY/i+kqVmwoTEYAAAAASUVORK5CYII=';
		
		// Make bush 1 more transparent
		structures.bush_01.img.scale = 0.9;
		structures.bush_01.img.sprite = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABCCAMAAADQfyDnAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAA/UExURUdwTBIQDBhGBBhEAytJAWeERRo2CDhZGR85A4ClXw8NCSIlGiZJDzAgExAVECwuJDU8KxYUD1ZdQA8QDhESDpK1VeAAAAAVdFJOUwAKcGN/f3p/f38ULVkFPEg4In9PGkRdqfgAAAJ2SURBVFjDpVhJYsMwCAS0odV27P+/tYfWsWQtVhMOyaVMWEYwFGBgGOEr82JBAEC/fehPzMHhKpg2AIjOTbvGtHvciJmZiJlZOPSBaBohadakOTMhNDMvz64YAcAXvpk9h+CEWNZE3LOwpsUP68bPNgxjmQDgdVABMQMgsNu9bvUK0+0q4BrEzV/K/CurwpJcTfJU/ZI0xsjfrzqKmhJ79UfGGGPk7+dzIer6/bqeJh8A4qo7nh2MGxuOoPkRoCyFSMcVfkneOQBm2s8oNj3nfy/EmxDHVPw1gj4jQJr0N8aYjFbvTsRQ9v4J4v2443sKdAHUawAg3NlDbgMoZa1VStleL5b38G2WQNnTlFJNAO3LAhQAr8vfWmvbbBBYTqHc35ammr0kBIC1mYC6AdgmGwQWPDT9AIoQrixCBADXAlCTANBLwdbWZAIWk0SOIshDuPq4lXtsCHAhZG0IMR+mcuh/AZREcGISQLWIsADAQTXAy87VgA7It/m4C7bXxosIQ4DiYZ8ACXpEUEMeyeI9589xwITmYwrxvpM6MeQDIR+shPe1mjVCKdWqn6kXnKPeSGvNozwCvd6HsqxG6qseq/WGzZ7Df6b6J5vplkFjM/1rt7U20wNCuRvDJVBzeTBCKNf7lgs8MQNQapRS7XXJ0AuAtoFKk7IKpJJp+7NO/JMDbX+u5OqmGzpP/gHJCc2OC90hTjFSaV3W1JLsLk2JdWYdfEewb1NqnZf45b0wOFnSTAKjM9TtRKM0xB4ojU9OdF6Mgo8T97QLvaNv9nLFXetbKlrsyeP87ewO53wSREIQM7NO+Mn5jogR3So0+a/+jYDHKPcfz0VfQPnpDbAAAAAASUVORK5CYII=';
		
		// Make bush 7 more transparent
		structures.bush_07.img.scale = 0.9;
		structures.bush_07.img.sprite = 'data:image/png;base64,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';
		
		// Make tree 1 more transparent
		structures.tree_01.img.scale = 1.3;
		structures.tree_01.img.sprite = 'data:image/png;base64,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';
		
		// Make tree 7s more transparent
		structures.tree_07s.img.scale = 1.3;
		structures.tree_07s.img.sprite = 'data:image/png;base64,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';
		
		// Make tree 8s more transparent
		structures.tree_08s.img.scale = 1.3;
		structures.tree_08s.img.sprite = 'data:image/png;base64,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';
		
		//////////////// Grenades
		
		// Make frag bigger and red
		throwables.frag.worldImg.scale = 0.6;
		throwables.frag.worldImg.sprite = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAA+CAMAAABjsdmeAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAADhUExURUdwTHQAAHIAAHMAAHIAAHIAAG0AAHQAAHQAAHQAAHQAAHIAAHQAAHQAAHQAAHMAAHIAAHQAAHMAAHQAAHIAAHMAAHMAAHQAAHMAAHMAAHQAAHMAAHIAAHQAAHMAAHQAAHQAAHQAAHQAAHIAAHQAAHIAAHMAAHQAAHQAAOoAAMwAAHIAAOsAAJ8AAIAAAOkAAMQAAOEAAJsAAOYAAKoAAL0AANYAAIMAAHcAAHoAAMoAALAAAM0AAIwAANAAAH0AAHAAAJEAAIgAAK0AAMcAANwAALQAAN4AAIUAAKYAAJYAACwyOQ4AAAAodFJOUwD9C3tYWQH4G+P2B/Lb5y8Zv3SYKm5jVKxN6jkRf0Gx7M3GNNAhh9G9JgDIAAACzklEQVRIx+2W23qiMBSFo7aIKlKP1Xr8rG3RhFJAsIrFs1N9/weasAMoFeDr1dzMulL52WySlbVFyFOaj1Qa3aol5CIktELw+6wUoez97/C7f4TP3wOax+NY+whIw/G4PFlOfC0nciIe0H/8eiGXy8mCCj4k4nvDOsna+azJJ8vYJ+Hf25WEXUmrr2+cYDF8bS4cbbG7XzmSy6Si8FSG+0mnKwO/gzX1MXXu2u9rUPlxuAvdosvi1cYyPhaLD8ParLB7RzFTCNAVj/7e2apCQIpq72YeX7niuQaj8fvUpOzYFb3DnL6zG4qNS/+9HKO3e8Vn3Tv0/Rb4VK7n0XyZ0Rt7HCJ7w+qX+cAS4i+ThOHE/MLXy1kTgJ5NQmnKT9gLCzUo3oVnfRrjSBmfgHSd8vwIimsqiaKJCvkhjZzuH/POx9WCRFcnC4in/CPtpQrFZX0cIx18L1U51BlCXwaJw4kB0LCDaiVYFjMeN2FxSjXUcvYfn9V4XD07eLGFGtnk1r3msw1Ud7Z0PVXicWXq4Kk6qjjvsLbGCbLWDldBdcB3SdV3gNdRw2kGn5J6P0EzDbapWEvCwQZ0W9sDOBiH+IU8wCEZtBEP9p0v4nFmGoFH6SZ4xop9V8UCzzRpfmTYUYrrhhzYgcoghNpPYJ9jTHnlCMjTs5NffZYC0SYjJkuDPmQZOx/SKcplRJUl73RQdfosqXZ6eBLoO3a97wZlrwRf58cwnuhHWESp1POzmkX75/S2H/JnymIge0ntTtNNZs0OPoDotuZeanYumVorS36m6sSX7ieqVH65Tmxx6MX7TDbsg0p1sA155gX8UAzOA7HszQ468GbbzWY7c0ag+2O59nPavFQvo8ydk57y1ZfbWdapC+GTTKiH/e1EnFjN3cK5qsihcBWeX0f5azY/en0uoGhxfKvbfCs9UZXemt3WA4cSxKV5sU0lPqRv2b+Rc0ib/o+U3QAAAABJRU5ErkJggg==';
		
		// Make mirv bigger and red
		throwables.mirv.worldImg.scale = 0.6;
		throwables.mirv.worldImg.sprite = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAABKCAMAAAD+HOYOAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAACfUExURUdwTF4AAF4AAF0AAF4AAFsAAF4AAF4AAF4AAF0AAF0AAF4AAF4AAF0AAF0AAF4AAF4AAF0AAF0AAF0AAF0AAFsAAF0AAF0AAF4AAF4AAFsAAF0AAF4AAF4AAF4AAMIAAKAAAF0AAGcAAG4AALkAAJoAAIAAAGQAAGIAAH4AAJEAAJYAAGAAAGwAAIoAAHsAAJ4AAJwAAHQAALEAAIcAAFtVMisAAAAedFJOUwDj6BjaBB/lHBmRzPE3TvrVFmtcDSR1iramIyHBswaS+IsAAAHdSURBVEjH7ZZtb4IwEIAroUipIiiqUbcBOou8o/7/3zZoQQFbbZZt8cOeTyR9ckfpcVcAGFDXuOgQdLG3Ay5buyci9Z2Lil5ODFo8EoPseCULHonHw5Xjq4qym5H+PD94MnA24oujWacg4ULgleaiZcJp43leTIjvExJ7XmNOb6ap1Bo5HdIwKgnTw4nUqmI23hzXWhYW7pUizAKm4nmd2GCen+Zuhzz1mWmw5OMh80L3jpCZw3ErYJC6HNLgFlKzaMAs54l5RkNaWinOJtUjCV0uIalWJ7NSXNKAp4IvFicacgmAs6oe4tQVkMbV+soBtvUoc5PbsgEaUDESiRGpi0inoh99Coj8an2g12LsC4k7YlU3fNhqS3zMN0VRXiYiPBwM6SnGya5HQjcyKQWMAEQ6ooXmJed9j3Pi0SIrFVaRNL2323/02O88lrbhX/xDUfoIpYtCusx+r8Ilfy7p31WiAbBJJNFSbCzTpLANnDf6jheReKGbeXPkG6l8a96oz5u9urmND/J0fDQDKeENpKQ1kORHnHhoku7QlB/D8oO9NBVRJSrT7qXCxHwPm/3b8NrgBFWMNbgDjg2rc1cZWcYYAh5QNxfGCluqauGVsTB1vsZc6NhI05Dt9KUvYRwTBDmAfDUAAAAASUVORK5CYII='
		
		// Make mirv mini bigger and red
		throwables.mirv_mini.worldImg.scale = 0.6;
		throwables.mirv_mini.worldImg.sprite = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAnCAMAAABDnVrwAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAADbUExURUdwTF4AAFwAAF4AAF0AAF4AAF4AAFwAAFMAAF4AAF4AAF4AAF4AAF0AAF4AAF0AAF0AAF4AAF0AAF0AAF4AAF4AAF4AAF4AAF4AAF0AAF4AAF4AAF0AAFwAAF0AAF4AAF0AAF0AAF0AAF0AAF0AAF4AAF0AAF0AAFsAANYAAF4AAF0AANcAAFsAAGEAAM4AAIsAAKkAAHUAAJkAANEAAGAAAGUAAG8AAHgAAMAAAMkAANQAAK0AAGkAAHwAAKUAAGsAALsAAJIAAIgAALUAAKIAAIMAAJUAAIcAAL34UdAAAAApdFJOUwD+EPH8+o8EAWf22W1k6yxI4Aswqmqx5tFNx4IYOKRmKB0ZcD+JVnUpup7TJwAAAjZJREFUOMuNlOdy4kAQhBGcwpEsDJgMtnFiV1mgGEi2ufd/ottZ4UIJrP6j0uqrUVfvzFQqRfr4qJRW9eGhWhrus2y/LNttINTolmPv58iy0Py+FNyqK4eDUm+VYe8a2NH1CDfufkWF6Rwh23FshOZT4Tb73ByzCGEihNhxf3oD5UeAXsSOR/zVGJbtMwWFqdrLK6FUuToFZWyFoUUe8FbnCu+Sn1AL8k7bfrru51bbydTKpMCJ0KpBWUXbryWq9V5ToHitJRTEC2z4pUrSikqS1K8Q6HzgPAespftnlOK+boETLmuk2wHYTLJAm1C6ky3dZAjreCmWyDMIzTQzEffgf9tVTls476XDfiIu8M7NFl5J7o6UbjylLZO7w5Gah9WIwO206RcSsnxc5+H1Pxmh2ksKFgHWimANYDEFv5G2kL+L4G8C19/Ssw8pG14eptmh5GYQ3ll6f/s8vLcAZt8v/THrICW+wCzsm9B6CurMLiawfSQ0trNBS65NCitHG/fORoQlq5x08Ia1dNKSqsGpoZ8Utimce4jMfqBt4GLNJC2pJzjbaIHu4HhFVUlbhIZhU3hz8C797B3iM9swQtIgVbqAmD9UDJ3AKPB8GBTfCyI6hT9fYUXxYv8v1eKVzjZWHFMPAt106FCh9usi/t4XkzPALwbxHpDlzUaOhxsNWlc2hzAaMiglZji6usKER26QZAfc4611x8+4YY2WZ2pDbsb/skb5Z3E54bjJUpzy5Za/UPz3/xe6ixh/xqT3AAAAAElFTkSuQmCC'
		
		//map-barrel-res-01.img
		
		// Make buildings roofs transparent
		Object.keys(structures).forEach(function(index) {
			if( structures[index].ceiling ) {
				if( structures[index].ceiling.imgs ) {
					Object.keys(structures[index].ceiling.imgs).forEach( function(item) {
						structures[index].ceiling.imgs[item].alpha = 0;
					});
				}
			}
		});


		
		// Make trees scale 0.2
		// filter(Defs, /tree/).forEach(function (e) {
			// if (Defs[e].img) {
				// a("ceee80d9").Defs[e].img.scale = 0.2;
			// }
		// })
		
		// Make bushes scale 0.2
		// filter(Defs, /bush/).forEach(function (e) {
			// if (Defs[e].img) {
				// a("ceee80d9").Defs[e].img.scale = 0.2;
			// }
		// })
		
		// Make tables scale 0.2
		// filter(Defs, /table/).forEach(function (e) {
			// if (Defs[e].img) {
				// a("ceee80d9").Defs[e].img.scale = 0.2;
			// }
		// })
		



		function call_later() {

			
			// Zoom Radius
			var setZoomRadius = function(radius) {
				if ( game_settings.scopeZoomRadius.desktop ) {
					game_settings.scopeZoomRadius.desktop["1xscope"] = radius;
					game_settings.scopeZoomRadius.desktop["2xscope"] = radius;
					game_settings.scopeZoomRadius.desktop["4xscope"] = radius;
					game_settings.scopeZoomRadius.desktop["8xscope"] = radius;
					game_settings.scopeZoomRadius.desktop["15xscope"] = radius;
				} else {
					console.error("Scope zoom and radius not patched");
				}
			};
		
			var zoomRadius = game_settings.scopeZoomRadius.desktop["1xscope"];

			var mouseListener = {
				wheel: function(e) {
					if(e.shiftKey) {
						window.removeEventListener('wheel', _hacker[zoom_variable_key].input.bOnMouseWheel);
						
						var delta = e.deltaY || e.detail || e.wheelDelta;
						zoomRadius += Math.sign(delta) * 10;
						if(zoomRadius < 10) zoomRadius = 10;
						if(zoomRadius > 1000) zoomRadius = 1000;
						setZoomRadius(zoomRadius)
					} else {
						window.addEventListener('wheel', _hacker[zoom_variable_key].input.bOnMouseWheel);
					}
				} 
			};
		
			window.addEventListener('wheel', mouseListener.wheel);
			
			// TO DO: add auto dodge
			
			// TO DO: add switching guns right click

			// Mouse down repeat click (autofire)
			window.addEventListener('mousedown', function(e) {
				
				//console.error( _hacker[input_parent_key][input_child_key] );
				// e.button = 0 -> left click
				// e.button = 2 -> right click
				
				// Detect left click
				if ( e.button == 0 ) {

					// Override the mouse down function
					_hacker[input_parent_key][input_child_key] = function(e) {
						if ( e == 0 ) {
							return true;
						} else {
							return !_hacker[input_parent_key].mouseButtonsOld[e] && !!_hacker[input_parent_key].mouseButtons[e];
						}
					};

				}
			});

			window.addEventListener('mouseup', function(e) {
				
				// Detect left click
				if (e.button == 0) {
					
					// Revert the mouse down function
					_hacker[input_parent_key][input_child_key] = function(e) {
						return !_hacker[input_parent_key].mouseButtonsOld[e] && !!_hacker[input_parent_key].mouseButtons[e];
					};
				}
			});
			
			
			// Disable auto aim with shift key hold
			window.addEventListener( 'keydown', function(e) {
				
				if ( e.keyCode == 16 ) {
					auto_aim_enabled = false;
				}
			});
			
			// Enable auto aim with shift key hold no more
			window.addEventListener( 'keyup', function(e) {
				
				if ( e.keyCode == 16 ) {
					auto_aim_enabled = true;
				}
			});
			
			
			
			// _hacker[input_parent_key][input_child_key] = function(){
				// return true;
			// };
			
			// _hacker['Pe']['input']['re'] = function(){
				// if ( mouseButton_bool ) {
					// return true;
				// }
			// };
		}
    }
}, ["c99e6613"]);
//# sourceMappingURL=app.50d15b72.js.map
