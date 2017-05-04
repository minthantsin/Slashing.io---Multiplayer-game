var player_properties; 

var set_player = function () {
	//in game properties 
	this.speed = 400; 
	this.dashspeed = 1000;  
	this.attack_cooldown = 1; 
	this.level = 1; 
	this.player_value = 100;
	this.exp_max = 100;
	this.player_health = 10;
	this.killed = false; 
	this.next_time = 0; 
	this.stunned_time = 0;
	this.free_tiime = 0;
	this.stunned = false; 
	this.first = false; 
	this.speed_boost = false; 
	this.stun_immune = false; 
	this.pierce = false; 
	
	
	// list of items 
	this.items = []; 
	// list of items with body 
	this.items_p = [];
	
	// list of items in collision with the sword 
	this.in_cols = [];
	
	//player skills 
	this.next_attack = gameProperties.current_time; 
	this.canattack = true; 
	this.player_attack = false; 
	
	//player ranks and gui properties 
	this.player_id = 0; 
	this.points = 0;
	this.player_score = 0; 
	this.text_list = []; 
	this.txt_playerlst = [];
	this.displaying_text = false; 
	this.display_onplayertext = false; 
	
	
	this.itemsdestroy = function () {
		for (var i = 0; i < this.items.length; i++) {
			this.items[i].destroy(true,false)
		}
		for (var k = 0; k < this.items_p.length; k++) {
			this.items_p[k].destroy(true,false)
		}
	}
	
	this.player_update = function () {
		player.body.angle = player.angle;
		
		//physics item 
		for (var i = 0; i < this.items_p.length; i++) {
			this.items_p[i].body.angle = player.angle; 
			this.items_p[i].body.velocity.x = player.body.velocity.x; 
			this.items_p[i].body.velocity.y = player.body.velocity.y; 
		}
		
		//normal item 
		for (var k = 0; k < this.items.length; k++) {
			if (this.items[k].name === 'name') {
				this.items[k].x = player.x;
				this.items[k].y = player.y + 50; 
			} else {
				this.items[k].x = player.x; 
				this.items[k].y = player.y - 100; 
			}
		}
	}
	
	this.player_stunned = function () {
		this.player_attack = false; 
		this.latest_x = player.body.velocity.x;
		this.latest_y = player.body.velocity.y; 
		player.body.velocity.x = player_properties.latest_x * -1/10; 
		player.body.velocity.y = player_properties.latest_y * -1/10; 
		this.stunned_time = 2;
		this.free_time = game.time.totalElapsedSeconds() + player_properties.stunned_time; 
		this.stunned = true; 
	}
	
	this.onLevelup = function () {
		this.level += 1; 
		
		//increase the maximum exp max value
		this.exp_max *= 1.5; 
		this.player_value *= 1.3;
		
		
		if (this.dashspeed <= 2000) {
			this.dashspeed += 20; 
		}
		
		if (this.speed <= 700) {
			this.speed += 20; 
		}
		
		
		var level_lst = [];
		var index = 0; 
		
		//push the text that needs to be displayed in the level_lst; 
		level_lst.push('Movement Speed UP'); 
		level_lst.push('Dash Speed UP'); 
		level_lst.push('Player Level UP'); 
		var length = level_lst.length; 
		
		for (var i = 0; i < length; i++) {
			this.display_onPlayer(level_lst[i], 500); 
		}
	}
	
	this.display_onPlayer = function (string_text, delay_time) {
		var text_object = {
			text_info: string_text, 
			delay_time: delay_time
		}
		this.txt_playerlst.push(text_object); 
		
		if (this.display_onplayertext === false) {
			this.display_onplayertext = true;
			var text_display = string_text; 	
			player_followtext.alpha = 1; 
			player_followtext.setText(text_display); 
			
			var oncomplete = function () {
				this.txt_playerlst.splice(0, 1); 
				if (this.txt_playerlst.length > 0) {	
					var next_text = this.txt_playerlst[0].text_info; 
					var next_delay = this.txt_playerlst[0].display_time; 
					player_followtext.alpha = 1; 
					player_followtext.setText(next_text); 
					var tween_text = game.add.tween(player_followtext).to( { alpha: 0 }, 1000 , Phaser.Easing.Linear.None , true, delay_time);
					tween_text.onComplete.add(oncomplete, this); 
				} else {
					this.display_onplayertext = false;
					return; 
				}
			}
			
			var tween_text = game.add.tween(player_followtext).to( { alpha: 0 }, 1000 , Phaser.Easing.Linear.None , true, delay_time);
			tween_text.onComplete.add(oncomplete, this); 
			
		} else if (this.displaying_text === true) {
			return; 
		}
	}
	
	this.display_text = function (string_text, delay_time) {
		var text_object = {
			text_info: string_text, 
			delay_time: delay_time
		}
		this.text_list.push(text_object); 
		
		if (this.displaying_text === false) {
			this.displaying_text = true;
			var text_display = string_text; 	
			player_distext.alpha = 1; 
			player_distext.setText(text_display); 
			
			var oncomplete = function () {
				this.text_list.splice(0, 1); 
				if (this.text_list.length > 0) {	
					var next_text = this.text_list[0].text_info; 
					var next_delay = this.text_list[0].display_time; 
					player_distext.alpha = 1; 
					player_distext.setText(next_text); 
					var tween_text = game.add.tween(player_distext).to( { alpha: 0 }, 1000 , Phaser.Easing.Linear.None , true, delay_time);
					tween_text.onComplete.add(oncomplete, this); 
				} else {
					this.displaying_text = false;
					return; 
				}
			}
			
			var tween_text = game.add.tween(player_distext).to( { alpha: 0 }, 1000 , Phaser.Easing.Linear.None , true, delay_time);
			tween_text.onComplete.add(oncomplete, this); 
			
		} else if (this.displaying_text === true) {
			return; 
		}
	}
	
	this.first_place = function () {
		if (this.first === false) {
			this.first = true; 
			this.crown = game.add.sprite(0, 30, 'crown');
			this.crown.anchor.setTo(0.5, 0.5);
			this.crown.scale.setTo(0.1, 0.1);
			if (this.item_lst) {
				this.item_lst.push(this.crown);
			}
		} else {
			this.crown.x = player.x; 
			this.crown.y = player.y - 30;
		}
	}
	
	this.stun_immunepickup = function () {
		this.display_text('Stun Immune for 5 seconds', 1000);
		this.display_onPlayer('Stun Immune for 5 Seconds', 1000);
	}
	
	this.pierce_pickup = function () {
		this.pierce = true;
		this.display_text('Next Attack will Pierce', 1000); 
		this.display_onPlayer('Next Attack Will Pierce', 1000); 
		sword.loadTexture('sword_pierce');
	}
	
	this.speed_pickup = function () {
		this.speed_boost = true; 
		this.display_text('Speed Boost for 3 seconds', 1000); 
		this.display_onPlayer('Speed Boost for 3 seconds', 1000); 
		this.speed = 700;
	}
} 

function dash_draw () {
	var image_list = []; 
	var player_image = game.add.sprite(player.x,player.y, 'arrow');
	player_image.anchor.setTo(0.5, 0.5);
	player_image.scale.setTo(0.3, 0.3);
	game.add.tween(player_image).to( { alpha: 0 }, 300 , Phaser.Easing.Linear.None, true);
}


var remote_player = function (index, username, game, player, startx, starty, startangle) {
	this.item_lst = []; 
	this.itemp_lst = []; 
	this.id = index;
	this.username = username;
	
	this.enemy_score = 0; 
	
	this.player_attack = false;
	this.pierce = false;
	this.first = false; 
	this.game = game; 
	this.player = player; 
	this.angle = startangle;
	
	 
	this.player = game.add.sprite(startx, starty, 'arrow');
	this.player.anchor.setTo(0.5, 0.5);
	this.player.scale.setTo(0.3, 0.3);
	this.player.name = index.toString(); 
	this.game.physics.p2.enableBody(this.player,true);
	this.player.body.data.shapes[0].sensor = true;
	
	
	this.sword = game.add.sprite(50, 50, "sword");  
	this.game.physics.p2.enableBody(this.sword,true);
	this.sword.body.data.shapes[0].sensor = true;
	this.sword.scale.setTo(0.3, 0.3); 
	this.sword.name = index.toString();
	this.sword.body.clearShapes();
	this.sword.body.addRectangle(200, 30, 50, 50);
	this.sword.pivot.y = - 150;
	this.item_lst.push(this.sword); 
	
	
	//shield
	this.shield = game.add.sprite(200, 100, 'shield');
	this.shield.name = index.toString();
	game.physics.p2.enableBody(this.shield, true);
	this.shield.body.data.gravityScale = 0;
	this.shield.scale.setTo(0.4,0.4);
	this.shield.pivot.y = 200;
	this.shield.body.clearShapes();
	this.shield.body.addRectangle(100, 100, 0, -80)
	this.shield.body.data.shapes[0].sensor = true;
	this.item_lst.push(this.shield); 
	
	
	this.style = { font: "16px Arial", fill: "black", align: "center"};
	this.playertext = game.add.text(100, 100, this.username , this.style);
	this.playertext.anchor.set(0.5);
	this.item_lst.push(this.playertext); 
	
	
	this.enemy_attack = function () {
		var image_list = []; 
		var player_image = game.add.sprite(this.player.x, this.player.y, 'arrow');
		player_image.anchor.setTo(0.5, 0.5);
		player_image.scale.setTo(0.3, 0.3);
		game.add.tween(player_image).to( { alpha: 0 }, 300 , Phaser.Easing.Linear.None, true);
	}
	

	for (var i = 0; i < player_properties.in_cols.length; i++) {
		if (!player_properties.stunned && player_properties.player_attack) {
			console.log('attack');
			//emit message of the position of the player 
			socket.emit('player_attack', {player_id: socket.id, enemy_id: player_properties.in_cols[i]});
		}
	}

	
	this.first_place = function () {
		if (this.first === false) {
			this.first = true; 
			this.crown = game.add.sprite(200, 100, 'crown');
			this.crown.anchor.setTo(0.5, 0.5);
			this.crown.scale.setTo(0.1, 0.1);
			this.item_lst.push(this.crown);
		} else {
			this.crown.x = this.player.x; 
			this.crown.y = this.player.y; 
		}
	}
	
	this.pierce_effect = function () {
		this.pierce = true;
		this.sword.loadTexture('sword_pierce');
	}
	
	this.destroyitem = function () {
		for (var i = 0; i < this.item_lst.length; i++) {
			this.item_lst[i].destroy(true,false); 
		}
	}
	
	this.updateremote = function () {
		for (var k = 0; k < this.item_lst.length; k++) {
			this.item_lst[k].x = this.player.x; 
			this.item_lst[k].y = this.player.y - 50; 
		}
	}
	
	
}


// find players to be removed 
function onRemovePlayer (data) {
  var removePlayer = findplayerbyid(data.id)
  // Player not found
  if (!removePlayer) {
    console.log('Player not found: ', data.id)
    return;
  }

  removePlayer.player.destroy(true, false);  
  removePlayer.destroyitem(); 

  // Remove player from array
  enemies.splice(enemies.indexOf(removePlayer), 1);
}


// search through enemies list to find the right object of the id; 
function findplayerbyid (id) {
	for (var i = 0; i < enemies.length; i++) {
		if (enemies[i].player.name == id) {
			return enemies[i]; 
		}
	}
}



function movetoPointer (displayObject, speed, pointer, maxTime) {
	
		var bound_limit = 40;
		var upper_bound = bound_limit;
		var bottom_bound = game.world.height - bound_limit;
		var left_bound = bound_limit;
		var right_bound = game.world.width - bound_limit; 
		var play_bound = true; 

		
        if (speed === undefined) { speed = 60; }
        pointer = pointer || this.game.input.activePointer;
        if (maxTime === undefined) { maxTime = 0; }

        var angle = angleToPointer(displayObject, pointer);

        if (maxTime > 0)
        {
            //  We know how many pixels we need to move, but how fast?
            speed = distanceToPointer(displayObject, pointer) / (maxTime / 1000);
        }
		
		if (displayObject.body.y < upper_bound || displayObject.body.y > bottom_bound) {
			if (!(game.input.worldY > upper_bound && game.input.worldY < bottom_bound)) {
				displayObject.body.velocity.y = 0;
			} else {
				displayObject.body.velocity.x = Math.cos(angle) * speed;
				displayObject.body.velocity.y = Math.sin(angle) * speed;
			}
		} else if (displayObject.body.x < left_bound || displayObject.body.x > right_bound) {
			if (!(game.input.worldX > left_bound && game.input.worldX < right_bound)) {
				displayObject.body.velocity.x = 0;
			} else {
				displayObject.body.velocity.x = Math.cos(angle) * speed;
				displayObject.body.velocity.y = Math.sin(angle) * speed;
			}
		}

		displayObject.body.velocity.x = Math.cos(angle) * speed;
		displayObject.body.velocity.y = Math.sin(angle) * speed;
        return angle;

}

function distanceToPointer (displayObject, pointer, world) {

        if (pointer === undefined) { pointer = game.input.activePointer; }
        if (world === undefined) { world = false; }

        var dx = (world) ? displayObject.world.x - pointer.worldX : displayObject.x - pointer.worldX;
        var dy = (world) ? displayObject.world.y - pointer.worldY : displayObject.y - pointer.worldY;

        return Math.sqrt(dx * dx + dy * dy);

}

function angleToPointer (displayObject, pointer, world) {

        if (pointer === undefined) { pointer = game.input.activePointer; }
        if (world === undefined) { world = false; }

        if (world)
        {
            return Math.atan2(pointer.worldY - displayObject.world.y, pointer.worldX - displayObject.world.x);
        }
        else
        {
            return Math.atan2(pointer.worldY - displayObject.y, pointer.worldX - displayObject.x);
        }

}