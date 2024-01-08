"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "FavoriteDashboardsPluginSetup", {
  enumerable: true,
  get: function () {
    return _types.FavoriteDashboardsPluginSetup;
  }
});
Object.defineProperty(exports, "FavoriteDashboardsPluginStart", {
  enumerable: true,
  get: function () {
    return _types.FavoriteDashboardsPluginStart;
  }
});
exports.plugin = plugin;

var _plugin = require("./plugin");

var _types = require("./types");

//  This exports static code and TypeScript types,
//  as well as, Kibana Platform `plugin()` initializer.
function plugin(initializerContext) {
  return new _plugin.FavoriteDashboardsPlugin(initializerContext);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJwbHVnaW4iLCJpbml0aWFsaXplckNvbnRleHQiLCJGYXZvcml0ZURhc2hib2FyZHNQbHVnaW4iXSwic291cmNlcyI6WyJpbmRleC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQbHVnaW5Jbml0aWFsaXplckNvbnRleHQgfSBmcm9tICcuLi8uLi8uLi9zcmMvY29yZS9zZXJ2ZXInO1xuaW1wb3J0IHsgRmF2b3JpdGVEYXNoYm9hcmRzUGx1Z2luIH0gZnJvbSAnLi9wbHVnaW4nO1xuXG4vLyAgVGhpcyBleHBvcnRzIHN0YXRpYyBjb2RlIGFuZCBUeXBlU2NyaXB0IHR5cGVzLFxuLy8gIGFzIHdlbGwgYXMsIEtpYmFuYSBQbGF0Zm9ybSBgcGx1Z2luKClgIGluaXRpYWxpemVyLlxuXG5leHBvcnQgZnVuY3Rpb24gcGx1Z2luKGluaXRpYWxpemVyQ29udGV4dDogUGx1Z2luSW5pdGlhbGl6ZXJDb250ZXh0KSB7XG4gIHJldHVybiBuZXcgRmF2b3JpdGVEYXNoYm9hcmRzUGx1Z2luKGluaXRpYWxpemVyQ29udGV4dCk7XG59XG5cbmV4cG9ydCB7IEZhdm9yaXRlRGFzaGJvYXJkc1BsdWdpblNldHVwLCBGYXZvcml0ZURhc2hib2FyZHNQbHVnaW5TdGFydCB9IGZyb20gJy4vdHlwZXMnO1xuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0E7O0FBU0E7O0FBUEE7QUFDQTtBQUVPLFNBQVNBLE1BQVQsQ0FBZ0JDLGtCQUFoQixFQUE4RDtFQUNuRSxPQUFPLElBQUlDLGdDQUFKLENBQTZCRCxrQkFBN0IsQ0FBUDtBQUNEIn0=