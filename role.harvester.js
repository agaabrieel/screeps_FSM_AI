var roleHarvester = {
	
	processIdleState: function(creep) {
	    
	    var source = creep.room.find(FIND_SOURCES)[0];
	    creep.memory.targetId = source.id;
	    
	    if (!creep.pos.isNearTo(source)) {
	        creep.say("IDLE_STATE -> MOVE_STATE : MOVING TO ENERGY SOURCE");
	        creep.memory.currentState = 'MOVE_STATE';
	        return
	    }
	    
	    creep.say("IDLE_STATE -> HARVEST_STATE : HARVESTING ENERGY SOURCE");
	    creep.memory.currentState = 'HARVEST_STATE';
	    
	},
	
	processMoveState: function(creep) {
	    
	    var target = Game.getObjectById(creep.memory.targetId);
	    
	    if (creep.pos.isNearTo(target)) {
	        
	        if (target.structureType == undefined) {

                creep.say("MOVE_STATE -> HARVEST_STATE : HARVESTING ENERGY SOURCE");
                creep.memory.currentState = 'HARVEST_STATE';
                return
	            
	        } else {
    	        creep.say("MOVE_STATE -> TRANSFER_STATE : TRANSFERING ENERGY TO STORAGE");
                creep.memory.currentState = 'TRANSFER_STATE';
                return
	        }
	    }

	    creep.moveTo(target);
	},
	
	processHarvestState: function(creep) {
	    
	    if (creep.store.getFreeCapacity() == 0) {
	        creep.say("HARVEST_STATE -> MOVE_STATE : STORE FULL OF ENERGY, MOVING TO DEPOSIT");
	        creep.memory.currentState = 'MOVE_STATE';
	        try {
                creep.memory.targetId = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_CONTAINER } } ).id;
                return
	        } catch (e) {
                console.log(e);
	        } finally {
	            creep.memory.targetId = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_SPAWN } } ).id;
	            return
	        }
	    }
	
	    const source = Game.getObjectById(creep.memory.targetId);
	    creep.harvest(source);
	
	},
	
	processTransferState: function(creep) {
	    
    	const storage = Game.getObjectById(creep.memory.targetId);
        creep.transfer(storage, RESOURCE_ENERGY);
        creep.say("TRANSFER_STATE -> MOVE_STATE : MOVING BACK TO ENERGY SOURCE");
        creep.memory.currentState = 'MOVE_STATE';
        creep.memory.targetId = creep.room.find(FIND_SOURCES)[0].id;
	    
	},
	
	/** @param {Creep} creep **/
    run: function(creep) {

        var currentState = creep.memory.currentState;
        
        switch (currentState) {
            case 'IDLE_STATE':
                roleHarvester.processIdleState(creep);
                break
            case 'MOVE_STATE':
                roleHarvester.processMoveState(creep);
                break
            case 'HARVEST_STATE':
                roleHarvester.processHarvestState(creep);
                break
            case 'TRANSFER_STATE':
                roleHarvester.processTransferState(creep);
                break
            default:
                console.log("UNRECOGNIZED STATE")
            }
        
    	}
};

module.exports = roleHarvester;
