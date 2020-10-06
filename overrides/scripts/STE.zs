import scripts.CommonVars.makeShaped as makeShaped;

// Solidified Experience
solidifier.recipeBuilder()
    .fluidInputs([<liquid:xpjuice> * 160])
    .notConsumable(<gregtech:meta_item_1:32307>)
    .outputs(<actuallyadditions:item_solidified_experience>)
    .duration(500).EUt(16).buildAndRegister();

fluid_extractor.recipeBuilder()
	.inputs(<actuallyadditions:item_solidified_experience>)
	.fluidOutputs(<liquid:xpjuice> * 160)
	.duration(80).EUt(32).buildAndRegister();

// XP Juice
mixer.recipeBuilder()
	.inputs(<ore:itemPulsatingPowder>)
    .fluidOutputs(<liquid:xpjuice> * 2240) // 8L
    .fluidInputs(<liquid:mana> * 250)
    .duration(100).EUt(480).buildAndRegister();

mixer.recipeBuilder()
	.inputs(<ore:itemVibrantPowder>)
    .fluidOutputs(<liquid:xpjuice> * 4480) // 16L
    .fluidInputs(<liquid:mana> * 250)
    .duration(100).EUt(480).buildAndRegister();

mixer.recipeBuilder()
	.inputs(<contenttweaker:grainsofinnocence>)
    .fluidOutputs(<liquid:xpjuice> * 6720) // 24L
    .fluidInputs(<liquid:mana> * 250)
    .duration(100).EUt(480).buildAndRegister();
	
mixer.recipeBuilder()
	.inputs(<ore:itemPrecientPowder>)
    .fluidOutputs(<liquid:xpjuice> * 8960) // 32L
    .fluidInputs(<liquid:mana> * 250)
    .duration(100).EUt(480).buildAndRegister();

mixer.recipeBuilder()
	.inputs(<ore:itemEnderCrystalPowder>)
    .fluidOutputs(<liquid:xpjuice> * 11200) // 40L
    .fluidInputs(<liquid:mana> * 250)
    .duration(100).EUt(480).buildAndRegister();

// Quantum Flux
mixer.recipeBuilder()
	.inputs(<ore:gemCrystalFlux>)
	.outputs(<contenttweaker:quantumflux> * 8)
    .fluidInputs(<liquid:mana> * 250)
    .duration(100).EUt(480).buildAndRegister();

// Rabbits
macerator.findRecipe(16, [<minecraft:rabbit>], [null]).remove();
centrifuge.findRecipe(5, [<minecraft:rabbit>], [null]).remove();
centrifuge.findRecipe(5, [<minecraft:cooked_rabbit>], [null]).remove();
recipes.removeByRecipeName("minecraft:rabbit_stew_from_red_mushroom");
recipes.removeByRecipeName("minecraft:rabbit_stew_from_brown_mushroom");
recipes.removeByRecipeName("minecraft:leather");
mods.jei.JEI.removeAndHide(<minecraft:rabbit>);
mods.jei.JEI.removeAndHide(<minecraft:cooked_rabbit>);
mods.jei.JEI.removeAndHide(<minecraft:rabbit_stew>);
mods.jei.JEI.removeAndHide(<minecraft:rabbit_foot>);
mods.jei.JEI.removeAndHide(<minecraft:rabbit_hide>);
furnace.remove(<minecraft:cooked_rabbit>);

// Network Visualization Tool
recipes.removeByRecipeName("ae2stuff:recipe5");
makeShaped("ae2stuff_nvt", <ae2stuff:visualiser>, [
		"S S",
		"EPE",
		"FFF",
	], {
		S: <metaitem:sensor.lv>,
        E: <appliedenergistics2:material:24>, // Eng Processor
        P: <ore:itemIlluminatedPanel>,
        F: <ore:crystalPureFluix>
	});

// Dense Conduit
assembler.recipeBuilder()
    .inputs([<enderio:item_me_conduit> * 4, <ore:itemConduitBinder> * 5])
    .outputs([<enderio:item_me_conduit:1> * 2])
    .duration(80)
    .EUt(16)
    .buildAndRegister();

// Conduit Binder Composite
mixer.recipeBuilder()
	.inputs([<ore:gravel> * 4, <ore:sand> * 4])
    .fluidInputs(<liquid:glue> * 50)
    .outputs([<ore:itemBinderComposite>.firstItem * 16])
    .duration(80).EUt(30).buildAndRegister();

// Nether Star
solidifier.recipeBuilder()
    .fluidInputs(<liquid:moltennetherstar> * 1296)
    .notConsumable(<gregtech:meta_item_1:32308>)
    .outputs([<extendedcrafting:storage:2>])
    .duration(200)
    .EUt(30)
    .buildAndRegister();

fluidextractor.recipeBuilder()
    .inputs(<minecraft:nether_star>)
    .fluidOutputs([<liquid:moltennetherstar> * 144])
    .duration(40)
    .EUt(30)
    .buildAndRegister();

// Lava Centrifungus
centrifuge.findRecipe(80, [null], [<liquid:lava> * 100]).remove();
centrifuge.recipeBuilder()
    .fluidInputs(<liquid:lava> * 200)
    .chancedOutput(<ore:nuggetSilver>.firstItem, 250, 80)
    .chancedOutput(<ore:nuggetTin>.firstItem, 1000, 270)
    .chancedOutput(<ore:nuggetCopper>.firstItem, 2000, 320)
    .chancedOutput(<ore:nuggetTantalum>.firstItem, 2500, 90)
    .chancedOutput(<ore:nuggetGold>.firstItem, 250, 80)
    .chancedOutput(<ore:dustSmallTungstate>.firstItem, 250, 70)
    .duration(1600).EUt(192).buildAndRegister();

// Rubber Plate
hammer.recipeBuilder()
    .inputs(<gregtech:meta_item_1:32627> * 6)
    .outputs(<ore:plateRubber>.firstItem)
    .duration(400).EUt(8).buildAndRegister();

compressor.findRecipe(8, [<gregtech:meta_item_1:32627>], [null]).remove();
compressor.recipeBuilder()
    .inputs(<gregtech:meta_item_1:32627> * 4)
    .outputs(<ore:plateRubber>.firstItem)
    .duration(200).EUt(8).buildAndRegister();

// Fireclay Brick
hammer.recipeBuilder()
    .inputs([<ore:dustFireclay> * 3])
    .outputs(<gregtech:meta_item_2:32014> * 2)
    .duration(200).EUt(8).buildAndRegister();
