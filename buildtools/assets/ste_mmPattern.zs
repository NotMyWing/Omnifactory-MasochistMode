var {{name}} = VanillaFactory.createItem("{{name}}");
{{name}}.rarity = "epic";
{{name}}.maxStackSize = 1;
{{name}}.register();
<contenttweaker:{{name}}>.addTooltip(format.italic(
	format.white("A stabilized version, injected with a Heart of a Universe.")));
<contenttweaker:{{name}}>.addTooltip(format.italic(
	format.white("Lasts indefinitely. Reusable. Totally not overpowered.")));

var {{name}}_matter = VanillaFactory.createItem("{{name}}_matter");
{{name}}_matter.rarity = "epic";
{{name}}_matter.glowing = true;
{{name}}_matter.maxStackSize = 64;
{{name}}_matter.register();
<contenttweaker:{{name}}_matter>.addTooltip(format.italic(
	format.white("It looks oddly familiar.")));

