/*global describe, baredom, sharedBehaviorForAttributesStoreOf*/
describe("impl/AttributesStore", function () {
    "use strict";
    function creator() {
        var stringStore = new baredom.impl.StringStore();
        return new baredom.impl.AttributesStore(stringStore);
    }
    sharedBehaviorForAttributesStoreOf(creator);
});
