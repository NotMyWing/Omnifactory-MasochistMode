import loottweaker.LootTweaker;
import loottweaker.vanilla.loot.LootTable;
import loottweaker.vanilla.loot.LootPool;

// Remove Zero Point Modules from Jungle Temples
val jungleTemple = LootTweaker.getTable("minecraft:chests/jungle_temple");
val pool = jungleTemple.getPool("main");

pool.removeEntry("#gregtech:loot_1xitem.meta_item@32599");

// Disable Rabbit loot
val rabbit = LootTweaker.getTable("minecraft:entities/rabbit");
rabbit.removePool("main");
rabbit.removePool("pool1");
rabbit.removePool("pool2");

// Disable Iron Golem loot
val golem = LootTweaker.getTable("minecraft:entities/iron_golem");
golem.removePool("main");
golem.removePool("pool1");
