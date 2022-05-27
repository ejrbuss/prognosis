import "../prognosis/math.js";
import { Color } from "../prognosis/color.js";

test("Color.rgb255", () => {
	expect(Color.rgb255(191, 180, 229).hex).toBe("#bfb4e5ff");
	expect(Color.rgb255(211, 200, 252).hex).toBe("#d3c8fcff");
	expect(Color.rgb255(125, 125, 221).hex).toBe("#7d7dddff");
});

test("Color.rgb", () => {
	expect(
		Color.rgb(0.7490196078431373, 0.7058823529411765, 0.8980392156862745).hex
	).toBe("#bfb4e5ff");
	expect(
		Color.rgb(0.8274509803921568, 0.7843137254901961, 0.9882352941176471).hex
	).toBe("#d3c8fcff");
	expect(
		Color.rgb(0.49019607843137253, 0.49019607843137253, 0.8666666666666667).hex
	).toBe("#7d7dddff");
});

test("Color.cmyk", () => {
	expect(
		Color.cmyk(0.165938864628821, 0.21397379912663753, 0, 0.10196078431372546)
			.hex
	).toBe("#bfb4e5ff");
	expect(
		Color.cmyk(0.6190476190476191, 0, 0.28174603174603174, 0.0117647058823529)
			.hex
	).toBe("#60fcb5ff");
	expect(
		Color.cmyk(0, 0.6113989637305699, 0.8290155440414508, 0.2431372549019608)
			.hex
	).toBe("#c14b21ff");
});

test("Color.hsl", () => {
	expect(
		Color.hsl(0.7040816326530611, 0.4851485148514851, 0.8019607843137255).hex
	).toBe("#bfb4e5ff");
	expect(
		Color.hsl(0.701923076923077, 0.8965517241379314, 0.8862745098039215).hex
	).toBe("#d3c8fcff");
	expect(
		Color.hsl(0.6666666666666666, 0.5853658536585368, 0.6784313725490196).hex
	).toBe("#7d7dddff");
});
