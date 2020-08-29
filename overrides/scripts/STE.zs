
// Solidified Experience
solidifier.recipeBuilder()
    .fluidInputs([<liquid:xpjuice> * 160])
    .notConsumable(<gregtech:meta_item_1:32307>)
    .outputs(<actuallyadditions:item_solidified_experience>)
    .duration(500).EUt(16).buildAndRegister();

fluid_extractor.recipeBuilder()
	.inputs(<gregtech:meta_item_1:32500>)
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
    .fluidOutputs(<liquid:xpjuice> * 8960) // 40L
    .fluidInputs(<liquid:mana> * 250)
    .duration(100).EUt(480).buildAndRegister();

// Quantum Flux
mixer.recipeBuilder()
	.inputs(<ore:gemCrystalFlux>)
	.outputs(<contenttweaker:quantumflux> * 8)
    .fluidInputs(<liquid:mana> * 250)
    .duration(100).EUt(480).buildAndRegister();
