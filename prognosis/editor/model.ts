import { Runtime } from "../runtime.js";
import { Signal } from "../signal.js";

export const ModelChanges = {
	treeChange: new Signal(),
};

Runtime.rootChanges.forward(ModelChanges.treeChange);
