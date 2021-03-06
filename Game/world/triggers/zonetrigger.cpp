#include "zonetrigger.h"

#include "world/objects/npc.h"
#include "world/world.h"

ZoneTrigger::ZoneTrigger(Vob* parent, World &world, ZenLoad::zCVobData &&d, bool startup)
  :AbstractTrigger(parent,world,std::move(d),startup){
  }

void ZoneTrigger::onIntersect(Npc &n) {
  if(n.isPlayer())
    world.triggerChangeWorld(data.oCTriggerChangeLevel.levelName,
                             data.oCTriggerChangeLevel.startVobName);
  }
