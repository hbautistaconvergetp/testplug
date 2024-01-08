"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defineRoutes = defineRoutes;

var _configSchema = require("@kbn/config-schema");

function defineRoutes(router, logger) {
  //logger.info('casa');
  // Route 1: Handling GET request to '/api/favorite_dashboards/example'
  router.get({
    path: '/api/favorite_dashboards/example',
    validate: false
  }, async (context, request, response) => {
    return response.ok({
      body: {
        time: new Date().toISOString()
      }
    });
  }); // Route 2: Handling GET request to '/api/create_index'

  router.post({
    path: '/api/create_index',
    validate: {
      query: _configSchema.schema.object({
        index: _configSchema.schema.string()
      })
    }
  }, async (context, request, response) => {
    const client = (await context.core).elasticsearch.client.asCurrentUser;
    const {
      index
    } = request.query;

    try {
      const existIndex = await client.indices.exists({
        index: index
      });

      if (existIndex) {
        return response.ok({
          body: {
            exist: existIndex
          }
        });
      } else {
        const createIndex = await client.indices.create({
          index: index,
          body: {
            mappings: {
              properties: {
                title: {
                  type: 'keyword'
                },
                description: {
                  type: 'text'
                },
                updatedAt: {
                  type: 'keyword'
                },
                url: {
                  type: 'keyword'
                },
                active: {
                  type: 'boolean'
                }
              }
            }
          }
        });
        return response.ok({
          body: {
            element: createIndex
          }
        });
      }
    } catch (e) {
      var _e$statusCode;

      return response.customError({
        statusCode: (_e$statusCode = e.statusCode) !== null && _e$statusCode !== void 0 ? _e$statusCode : 500,
        body: {
          message: e.message
        }
      });
    }
  });
  router.post({
    path: '/api/get_favorites',
    validate: {
      query: _configSchema.schema.object({
        index: _configSchema.schema.string()
      })
    }
  }, async (context, request, response) => {
    const client = (await context.core).elasticsearch.client.asCurrentUser;
    const {
      index
    } = request.query;

    try {
      const allFavorites = await client.search({
        index: index,
        query: {
          match_all: {}
        }
      });
      return response.ok({
        body: {
          values: allFavorites.hits.hits
        }
      });
    } catch (e) {
      var _e$statusCode2;

      return response.customError({
        statusCode: (_e$statusCode2 = e.statusCode) !== null && _e$statusCode2 !== void 0 ? _e$statusCode2 : 500,
        body: {
          message: e.message
        }
      });
    }
  });
  router.post({
    path: '/api/serarchindex',
    options: {
      body: {
        accepts: ['application/json']
      }
    },
    validate: {
      body: _configSchema.schema.object({
        dsdocument: _configSchema.schema.any()
      }),
      query: _configSchema.schema.object({
        index: _configSchema.schema.any()
      })
    }
  }, async (context, request, response) => {
    const client = (await context.core).elasticsearch.client.asCurrentUser;
    const {
      index
    } = request.query;
    const {
      dsdocument
    } = request.body;
    const dsjson = JSON.parse(dsdocument);

    try {
      const searchResult = await client.search({
        index: index,
        query: dsjson
      });
      return response.ok({
        body: {
          exist: searchResult
        }
      });
    } catch (e) {
      var _e$statusCode3;

      return response.customError({
        statusCode: (_e$statusCode3 = e.statusCode) !== null && _e$statusCode3 !== void 0 ? _e$statusCode3 : 500,
        body: {
          message: e.message
        }
      });
    }
  }); // Route 3 put values

  router.post({
    path: '/api/putdocindex',
    options: {
      body: {
        accepts: ['application/json']
      }
    },
    validate: {
      body: _configSchema.schema.object({
        dsdocument: _configSchema.schema.any()
      }),
      query: _configSchema.schema.object({
        index: _configSchema.schema.any()
      })
    }
  }, async (context, request, response) => {
    const client = (await context.core).elasticsearch.client.asCurrentUser;
    const {
      index
    } = request.query;
    const {
      dsdocument
    } = request.body;
    const dsjson = JSON.parse(dsdocument);

    try {
      const existDoc = await client.search({
        index: index,
        query: {
          term: {
            "id.keyword": {
              value: dsjson.id
            }
          }
        }
      });

      if (existDoc.hits.total.value == 1) {
        client.update({
          index: index,
          id: dsjson.id,
          doc: dsjson
        });
        return response.ok({
          body: {
            exist: 'update complete'
          }
        });
      } else {
        client.index({
          index: index,
          id: dsjson.id,
          document: dsjson
        });
        return response.ok({
          body: {
            element: 'true'
          }
        });
      }
    } catch (e) {
      var _e$statusCode4;

      return response.customError({
        statusCode: (_e$statusCode4 = e.statusCode) !== null && _e$statusCode4 !== void 0 ? _e$statusCode4 : 500,
        body: {
          message: e.message
        }
      });
    }
  });
  router.post({
    path: '/api/deletdashboard',
    validate: {
      query: _configSchema.schema.object({
        index: _configSchema.schema.any(),
        id: _configSchema.schema.string()
      })
    }
  }, async (context, request, response) => {
    const client = (await context.core).elasticsearch.client.asCurrentUser;
    const {
      index,
      id
    } = request.query;

    try {
      const existDoc = await client.delete({
        index: index,
        id: id
      });
      return response.ok({
        body: {
          element: existDoc
        }
      });
    } catch (e) {
      var _e$statusCode5;

      return response.customError({
        statusCode: (_e$statusCode5 = e.statusCode) !== null && _e$statusCode5 !== void 0 ? _e$statusCode5 : 500,
        body: {
          message: e.message
        }
      });
    }
  });
  router.post({
    path: '/api/stateindex',
    validate: {
      query: _configSchema.schema.object({
        index: _configSchema.schema.any(),
        id: _configSchema.schema.string(),
        state: _configSchema.schema.boolean()
      })
    }
  }, async (context, request, response) => {
    const client = (await context.core).elasticsearch.client.asCurrentUser;
    const {
      index,
      id,
      state
    } = request.query;

    try {
      //logger.info(id);
      const existDoc = await client.update({
        index: index,
        id: id,
        doc: {
          isChecked: state
        }
      });
      return response.ok({
        body: {
          element: existDoc
        }
      });
    } catch (e) {
      var _e$statusCode6;

      return response.customError({
        statusCode: (_e$statusCode6 = e.statusCode) !== null && _e$statusCode6 !== void 0 ? _e$statusCode6 : 500,
        body: {
          message: e.message
        }
      });
    }
  });
  router.post({
    path: '/api/updatestatus',
    validate: {
      query: _configSchema.schema.object({
        index: _configSchema.schema.string()
      })
    }
  }, async (context, request, response) => {
    const client = (await context.core).elasticsearch.client.asCurrentUser;
    const {
      index
    } = request.query;

    try {
      const createIndex = await client.updateByQuery({
        index: index,
        refresh: true,
        script: {
          lang: 'painless',
          source: 'ctx._source["isChecked"] = false'
        },
        query: {
          match_all: {}
        }
      });
      return response.ok({
        body: {
          element: createIndex
        }
      });
    } catch (e) {
      var _e$statusCode7;

      return response.customError({
        statusCode: (_e$statusCode7 = e.statusCode) !== null && _e$statusCode7 !== void 0 ? _e$statusCode7 : 500,
        body: {
          message: e.message
        }
      });
    }
  });
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJkZWZpbmVSb3V0ZXMiLCJyb3V0ZXIiLCJsb2dnZXIiLCJnZXQiLCJwYXRoIiwidmFsaWRhdGUiLCJjb250ZXh0IiwicmVxdWVzdCIsInJlc3BvbnNlIiwib2siLCJib2R5IiwidGltZSIsIkRhdGUiLCJ0b0lTT1N0cmluZyIsInBvc3QiLCJxdWVyeSIsInNjaGVtYSIsIm9iamVjdCIsImluZGV4Iiwic3RyaW5nIiwiY2xpZW50IiwiY29yZSIsImVsYXN0aWNzZWFyY2giLCJhc0N1cnJlbnRVc2VyIiwiZXhpc3RJbmRleCIsImluZGljZXMiLCJleGlzdHMiLCJleGlzdCIsImNyZWF0ZUluZGV4IiwiY3JlYXRlIiwibWFwcGluZ3MiLCJwcm9wZXJ0aWVzIiwidGl0bGUiLCJ0eXBlIiwiZGVzY3JpcHRpb24iLCJ1cGRhdGVkQXQiLCJ1cmwiLCJhY3RpdmUiLCJlbGVtZW50IiwiZSIsImN1c3RvbUVycm9yIiwic3RhdHVzQ29kZSIsIm1lc3NhZ2UiLCJhbGxGYXZvcml0ZXMiLCJzZWFyY2giLCJtYXRjaF9hbGwiLCJ2YWx1ZXMiLCJoaXRzIiwib3B0aW9ucyIsImFjY2VwdHMiLCJkc2RvY3VtZW50IiwiYW55IiwiZHNqc29uIiwiSlNPTiIsInBhcnNlIiwic2VhcmNoUmVzdWx0IiwiZXhpc3REb2MiLCJ0ZXJtIiwidmFsdWUiLCJpZCIsInRvdGFsIiwidXBkYXRlIiwiZG9jIiwiZG9jdW1lbnQiLCJkZWxldGUiLCJzdGF0ZSIsImJvb2xlYW4iLCJpc0NoZWNrZWQiLCJ1cGRhdGVCeVF1ZXJ5IiwicmVmcmVzaCIsInNjcmlwdCIsImxhbmciLCJzb3VyY2UiXSwic291cmNlcyI6WyJpbmRleC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJUm91dGVyIH0gZnJvbSAnLi4vLi4vLi4vLi4vc3JjL2NvcmUvc2VydmVyJztcbmltcG9ydCB7IHNjaGVtYSB9IGZyb20gJ0BrYm4vY29uZmlnLXNjaGVtYSc7XG5cbmltcG9ydCB0eXBlIHsgRGF0YVJlcXVlc3RIYW5kbGVyQ29udGV4dCB9IGZyb20gJ0BrYm4vZGF0YS1wbHVnaW4vc2VydmVyJztcblxuXG5leHBvcnQgZnVuY3Rpb24gZGVmaW5lUm91dGVzKHJvdXRlcjogSVJvdXRlcjxEYXRhUmVxdWVzdEhhbmRsZXJDb250ZXh0PiwgbG9nZ2VyOiBMb2dnZXIpIHtcbiAgICAvL2xvZ2dlci5pbmZvKCdjYXNhJyk7XG4gIFxuICAgIC8vIFJvdXRlIDE6IEhhbmRsaW5nIEdFVCByZXF1ZXN0IHRvICcvYXBpL2Zhdm9yaXRlX2Rhc2hib2FyZHMvZXhhbXBsZSdcbiAgICByb3V0ZXIuZ2V0KHtcbiAgICAgIHBhdGg6ICcvYXBpL2Zhdm9yaXRlX2Rhc2hib2FyZHMvZXhhbXBsZScsXG4gICAgICB2YWxpZGF0ZTogZmFsc2UsXG4gICAgfSxcbiAgICBhc3luYyAoY29udGV4dCwgcmVxdWVzdCwgcmVzcG9uc2UpID0+IHtcbiAgICAgIHJldHVybiByZXNwb25zZS5vayh7XG4gICAgICAgIGJvZHk6IHtcbiAgICAgICAgICB0aW1lOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9KTtcbiAgXG4gICAgLy8gUm91dGUgMjogSGFuZGxpbmcgR0VUIHJlcXVlc3QgdG8gJy9hcGkvY3JlYXRlX2luZGV4J1xuICAgIHJvdXRlci5wb3N0KHtcbiAgICAgIHBhdGg6ICcvYXBpL2NyZWF0ZV9pbmRleCcsXG4gICAgICAgdmFsaWRhdGU6IHtcbiAgICAgICAgcXVlcnk6IHNjaGVtYS5vYmplY3Qoe1xuICAgICAgICAgaW5kZXg6IHNjaGVtYS5zdHJpbmcoKSxcbiAgICAgICAgfSksXG4gICAgICAgfSxcbiAgICB9LFxuICAgIGFzeW5jIChjb250ZXh0LCByZXF1ZXN0LCByZXNwb25zZSkgPT4ge1xuICAgICAgY29uc3QgY2xpZW50ID0gKGF3YWl0IGNvbnRleHQuY29yZSkuZWxhc3RpY3NlYXJjaC5jbGllbnQuYXNDdXJyZW50VXNlcjtcbiAgICAgIGNvbnN0IHsgaW5kZXggfSA9IHJlcXVlc3QucXVlcnk7XG4gICAgICBcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGV4aXN0SW5kZXggPSBhd2FpdCBjbGllbnQuaW5kaWNlcy5leGlzdHMoeyBpbmRleDogaW5kZXggfSk7XG4gICAgICAgIFxuICAgICAgICBpZiAoZXhpc3RJbmRleCkge1xuICAgICAgICAgIHJldHVybiByZXNwb25zZS5vayh7XG4gICAgICAgICAgICBib2R5OiB7XG4gICAgICAgICAgICAgIGV4aXN0OiBleGlzdEluZGV4LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zdCBjcmVhdGVJbmRleCA9IGF3YWl0IGNsaWVudC5pbmRpY2VzLmNyZWF0ZSh7IGluZGV4OiBpbmRleCwgYm9keToge1xuICAgICAgICAgICAgbWFwcGluZ3M6IHtcbiAgICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICAgIHRpdGxlOiB7IHR5cGU6ICdrZXl3b3JkJyB9LFxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiB7IHR5cGU6ICd0ZXh0JyB9LCBcbiAgICAgICAgICAgICAgICB1cGRhdGVkQXQ6IHsgdHlwZTogJ2tleXdvcmQnIH0sXG4gICAgICAgICAgICAgICAgdXJsOiB7IHR5cGU6ICdrZXl3b3JkJyB9LFxuICAgICAgICAgICAgICAgIGFjdGl2ZTogeyB0eXBlOiAnYm9vbGVhbicgfSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSB9KTtcbiAgXG4gICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLm9rKHtcbiAgICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgICAgZWxlbWVudDogY3JlYXRlSW5kZXgsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHJldHVybiByZXNwb25zZS5jdXN0b21FcnJvcih7XG4gICAgICAgICAgc3RhdHVzQ29kZTogZS5zdGF0dXNDb2RlID8/IDUwMCxcbiAgICAgICAgICBib2R5OiB7XG4gICAgICAgICAgICBtZXNzYWdlOiBlLm1lc3NhZ2UsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIFxuICAgIHJvdXRlci5wb3N0KHtcbiAgICAgIHBhdGg6ICcvYXBpL2dldF9mYXZvcml0ZXMnLFxuICAgICAgIHZhbGlkYXRlOiB7XG4gICAgICAgIHF1ZXJ5OiBzY2hlbWEub2JqZWN0KHtcbiAgICAgICAgIGluZGV4OiBzY2hlbWEuc3RyaW5nKCksXG4gICAgICAgIH0pLFxuICAgICAgIH0sXG4gICAgfSxcbiAgICBhc3luYyAoY29udGV4dCwgcmVxdWVzdCwgcmVzcG9uc2UpID0+IHtcbiAgICAgIGNvbnN0IGNsaWVudCA9IChhd2FpdCBjb250ZXh0LmNvcmUpLmVsYXN0aWNzZWFyY2guY2xpZW50LmFzQ3VycmVudFVzZXI7XG4gICAgICBjb25zdCB7IGluZGV4IH0gPSByZXF1ZXN0LnF1ZXJ5O1xuICAgICAgXG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBhbGxGYXZvcml0ZXMgPSBhd2FpdCBjbGllbnQuc2VhcmNoKHsgaW5kZXg6IGluZGV4ICwgcXVlcnk6e21hdGNoX2FsbDp7fX0gfSk7XG4gICAgICAgIHJldHVybiByZXNwb25zZS5vayh7XG4gICAgICAgICAgYm9keToge1xuICAgICAgICAgICAgdmFsdWVzOiBhbGxGYXZvcml0ZXMuaGl0cy5oaXRzLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICByZXR1cm4gcmVzcG9uc2UuY3VzdG9tRXJyb3Ioe1xuICAgICAgICAgIHN0YXR1c0NvZGU6IGUuc3RhdHVzQ29kZSA/PyA1MDAsXG4gICAgICAgICAgYm9keToge1xuICAgICAgICAgICAgbWVzc2FnZTogZS5tZXNzYWdlLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICBcbiAgXG4gICAgXG4gICAgcm91dGVyLnBvc3Qoe3BhdGg6ICcvYXBpL3NlcmFyY2hpbmRleCcsXG4gICAgb3B0aW9uczoge1xuICAgICAgYm9keToge1xuICAgICAgICBhY2NlcHRzOiBbJ2FwcGxpY2F0aW9uL2pzb24nXVxuICAgICAgfSxcbiAgICB9LFxuICAgIHZhbGlkYXRlOiB7XG4gICAgICBib2R5OiBzY2hlbWEub2JqZWN0KHtcbiAgICAgICAgZHNkb2N1bWVudDogc2NoZW1hLmFueSgpXG4gICAgICB9KSxcbiAgICAgIHF1ZXJ5OiBzY2hlbWEub2JqZWN0KHtcbiAgICAgICAgaW5kZXg6IHNjaGVtYS5hbnkoKSxcbiAgICAgIH0pLFxuICAgIH0sXG4gIH0sXG4gIGFzeW5jIChjb250ZXh0LCByZXF1ZXN0LCByZXNwb25zZSkgPT4ge1xuICAgIGNvbnN0IGNsaWVudCA9IChhd2FpdCBjb250ZXh0LmNvcmUpLmVsYXN0aWNzZWFyY2guY2xpZW50LmFzQ3VycmVudFVzZXI7XG4gICAgY29uc3QgeyBpbmRleCB9ID0gcmVxdWVzdC5xdWVyeTtcbiAgICBjb25zdCB7IGRzZG9jdW1lbnQgfSA9IHJlcXVlc3QuYm9keTtcbiAgICBjb25zdCBkc2pzb24gPSAgSlNPTi5wYXJzZShkc2RvY3VtZW50KVxuICAgXG4gICAgXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHNlYXJjaFJlc3VsdCA9IGF3YWl0IGNsaWVudC5zZWFyY2goeyBpbmRleDogaW5kZXgsIHF1ZXJ5IDogZHNqc29uICB9KTtcbiAgICAgIHJldHVybiByZXNwb25zZS5vayh7XG4gICAgICAgIGJvZHk6IHtcbiAgICAgICAgICBleGlzdDogc2VhcmNoUmVzdWx0LFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSBcbiAgICAgY2F0Y2ggKGUpIHtcbiAgICAgIHJldHVybiByZXNwb25zZS5jdXN0b21FcnJvcih7XG4gICAgICAgIHN0YXR1c0NvZGU6IGUuc3RhdHVzQ29kZSA/PyA1MDAsXG4gICAgICAgIGJvZHk6IHtcbiAgICAgICAgICBtZXNzYWdlOiBlLm1lc3NhZ2UsXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xuICAgIC8vIFJvdXRlIDMgcHV0IHZhbHVlc1xuICAgIHJvdXRlci5wb3N0KHtcbiAgICAgIHBhdGg6ICcvYXBpL3B1dGRvY2luZGV4JyxcbiAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgYm9keToge1xuICAgICAgICAgIGFjY2VwdHM6IFsnYXBwbGljYXRpb24vanNvbiddXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgdmFsaWRhdGU6IHtcbiAgICAgICAgYm9keTogc2NoZW1hLm9iamVjdCh7XG4gICAgICAgICAgZHNkb2N1bWVudDogc2NoZW1hLmFueSgpXG4gICAgICAgIH0pLFxuICAgICAgICBxdWVyeTogc2NoZW1hLm9iamVjdCh7XG4gICAgICAgICAgaW5kZXg6IHNjaGVtYS5hbnkoKSxcbiAgICAgICAgfSksXG4gICAgICB9LFxuICAgIH0sXG4gICAgYXN5bmMgKGNvbnRleHQsIHJlcXVlc3QsIHJlc3BvbnNlKSA9PiB7XG4gICAgICBjb25zdCBjbGllbnQgPSAoYXdhaXQgY29udGV4dC5jb3JlKS5lbGFzdGljc2VhcmNoLmNsaWVudC5hc0N1cnJlbnRVc2VyO1xuICAgICAgY29uc3QgeyBpbmRleCB9ID0gcmVxdWVzdC5xdWVyeTtcbiAgICAgIGNvbnN0IHsgZHNkb2N1bWVudCB9ID0gcmVxdWVzdC5ib2R5O1xuICAgICAgY29uc3QgZHNqc29uID0gIEpTT04ucGFyc2UoZHNkb2N1bWVudClcbiAgICAgXG4gICAgICBcbiAgICAgIHRyeSB7XG4gICAgICAgICBcbiAgICAgICAgY29uc3QgZXhpc3REb2MgPSBhd2FpdCBjbGllbnQuc2VhcmNoKHsgaW5kZXg6IGluZGV4LCBxdWVyeSA6IHt0ZXJtIDoge1wiaWQua2V5d29yZFwiOiB7dmFsdWU6IGRzanNvbi5pZH19fSAgfSk7XG4gICAgICAgIGlmIChleGlzdERvYy5oaXRzLnRvdGFsLnZhbHVlID09MSApIHtcbiAgICAgICAgICBjbGllbnQudXBkYXRlKHtcbiAgICAgICAgICAgIGluZGV4OiBpbmRleCxcbiAgICAgICAgICAgIGlkOiBkc2pzb24uaWQsXG4gICAgICAgICAgICBkb2M6IGRzanNvblxuICAgICAgICAgfSk7XG4gICAgICAgICAgXG4gIFxuICAgICAgICByZXR1cm4gcmVzcG9uc2Uub2soe1xuICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgIGV4aXN0OiAndXBkYXRlIGNvbXBsZXRlJyxcbiAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gIFxuICAgICAgICBjbGllbnQuaW5kZXgoe1xuICAgICAgICAgIGluZGV4OiBpbmRleCxcbiAgICAgICAgICBpZDogZHNqc29uLmlkLFxuICAgICAgICAgIGRvY3VtZW50OiBkc2pzb25cbiAgICAgICAgfSk7XG4gIFxuICAgICAgICByZXR1cm4gcmVzcG9uc2Uub2soe1xuICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgIGVsZW1lbnQ6ICd0cnVlJyxcbiAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgICAgXG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHJldHVybiByZXNwb25zZS5jdXN0b21FcnJvcih7XG4gICAgICAgICAgc3RhdHVzQ29kZTogZS5zdGF0dXNDb2RlID8/IDUwMCxcbiAgICAgICAgICBib2R5OiB7XG4gICAgICAgICAgICBtZXNzYWdlOiBlLm1lc3NhZ2UsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIFxuICAgIHJvdXRlci5wb3N0KHtcbiAgICAgIHBhdGg6ICcvYXBpL2RlbGV0ZGFzaGJvYXJkJyxcbiAgICAgIFxuICAgICAgdmFsaWRhdGU6IHtcbiAgICAgICBcbiAgICAgICAgcXVlcnk6IHNjaGVtYS5vYmplY3Qoe1xuICAgICAgICAgIGluZGV4OiBzY2hlbWEuYW55KCksXG4gICAgICAgICAgaWQgOiBzY2hlbWEuc3RyaW5nKClcbiAgICAgICAgfSksXG4gICAgICB9LFxuICAgIH0sXG4gICAgYXN5bmMgKGNvbnRleHQsIHJlcXVlc3QsIHJlc3BvbnNlKSA9PiB7XG4gICAgICBjb25zdCBjbGllbnQgPSAoYXdhaXQgY29udGV4dC5jb3JlKS5lbGFzdGljc2VhcmNoLmNsaWVudC5hc0N1cnJlbnRVc2VyO1xuICAgICAgY29uc3QgeyBpbmRleCwgaWQgfSA9IHJlcXVlc3QucXVlcnk7IFxuICAgICAgdHJ5IHtcbiAgICAgICAgIFxuICAgICAgICBjb25zdCBleGlzdERvYyA9IGF3YWl0IGNsaWVudC5kZWxldGUoeyBpbmRleDogaW5kZXgsIGlkOiBpZCB9KTtcbiAgICAgICByZXR1cm4gcmVzcG9uc2Uub2soe1xuICAgICAgICBib2R5OiB7XG4gICAgICAgICAgZWxlbWVudDogZXhpc3REb2MsXG4gICAgICAgIH19KVxuICAgICAgXG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHJldHVybiByZXNwb25zZS5jdXN0b21FcnJvcih7XG4gICAgICAgICAgc3RhdHVzQ29kZTogZS5zdGF0dXNDb2RlID8/IDUwMCxcbiAgICAgICAgICBib2R5OiB7XG4gICAgICAgICAgICBtZXNzYWdlOiBlLm1lc3NhZ2UsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIFxuICAgIHJvdXRlci5wb3N0KHtcbiAgICAgIHBhdGg6ICcvYXBpL3N0YXRlaW5kZXgnLFxuICAgICAgXG4gICAgICB2YWxpZGF0ZToge1xuICAgICAgIFxuICAgICAgICBxdWVyeTogc2NoZW1hLm9iamVjdCh7XG4gICAgICAgICAgaW5kZXg6IHNjaGVtYS5hbnkoKSxcbiAgICAgICAgICBpZCA6IHNjaGVtYS5zdHJpbmcoKSxcbiAgICAgICAgICBzdGF0ZTogIHNjaGVtYS5ib29sZWFuKClcbiAgICAgICAgfSksXG4gICAgICB9LFxuICAgIH0sXG4gICAgYXN5bmMgKGNvbnRleHQsIHJlcXVlc3QsIHJlc3BvbnNlKSA9PiB7XG4gICAgICBjb25zdCBjbGllbnQgPSAoYXdhaXQgY29udGV4dC5jb3JlKS5lbGFzdGljc2VhcmNoLmNsaWVudC5hc0N1cnJlbnRVc2VyO1xuICAgICAgY29uc3QgeyBpbmRleCwgaWQgLCBzdGF0ZX0gPSByZXF1ZXN0LnF1ZXJ5OyBcbiAgICAgIHRyeSB7XG4gICAgICAgIC8vbG9nZ2VyLmluZm8oaWQpO1xuICAgICAgICBcbiAgICAgICAgY29uc3QgZXhpc3REb2MgPSBhd2FpdCBjbGllbnQudXBkYXRlKHsgaW5kZXg6IGluZGV4LCBpZDogaWQsIGRvYyA6IHtpc0NoZWNrZWQ6IHN0YXRlfX0pO1xuICAgICAgIHJldHVybiByZXNwb25zZS5vayh7XG4gICAgICAgIGJvZHk6IHtcbiAgICAgICAgICBlbGVtZW50OiBleGlzdERvYyxcbiAgICAgICAgfX0pXG4gICAgICBcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmN1c3RvbUVycm9yKHtcbiAgICAgICAgICBzdGF0dXNDb2RlOiBlLnN0YXR1c0NvZGUgPz8gNTAwLFxuICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgIG1lc3NhZ2U6IGUubWVzc2FnZSxcbiAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgXG4gICAgcm91dGVyLnBvc3Qoe1xuICAgICAgcGF0aDogJy9hcGkvdXBkYXRlc3RhdHVzJyxcbiAgICAgICB2YWxpZGF0ZToge1xuICAgICAgICBxdWVyeTogc2NoZW1hLm9iamVjdCh7XG4gICAgICAgICBpbmRleDogc2NoZW1hLnN0cmluZygpLFxuICAgICAgICB9KSxcbiAgICAgICB9LFxuICAgIH0sXG4gICAgYXN5bmMgKGNvbnRleHQsIHJlcXVlc3QsIHJlc3BvbnNlKSA9PiB7XG4gICAgICBjb25zdCBjbGllbnQgPSAoYXdhaXQgY29udGV4dC5jb3JlKS5lbGFzdGljc2VhcmNoLmNsaWVudC5hc0N1cnJlbnRVc2VyO1xuICAgICAgY29uc3QgeyBpbmRleCB9ID0gcmVxdWVzdC5xdWVyeTtcbiAgICAgIFxuICAgICAgdHJ5IHtcbiAgICAgICAgICBjb25zdCBjcmVhdGVJbmRleCA9IGF3YWl0IGNsaWVudC51cGRhdGVCeVF1ZXJ5KHtcbiAgICAgICAgICAgIGluZGV4OiBpbmRleCxcbiAgICAgICAgICAgIHJlZnJlc2g6IHRydWUsXG4gICAgICAgICAgICBzY3JpcHQ6IHtcbiAgICAgICAgICAgICAgbGFuZzogJ3BhaW5sZXNzJyxcbiAgICAgICAgICAgICAgc291cmNlOiAnY3R4Ll9zb3VyY2VbXCJpc0NoZWNrZWRcIl0gPSBmYWxzZSdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBxdWVyeToge1xuICAgICAgICAgICAgICBtYXRjaF9hbGw6IHtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLm9rKHtcbiAgICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgICAgZWxlbWVudDogY3JlYXRlSW5kZXgsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0pO1xuICAgICAgICBcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmN1c3RvbUVycm9yKHtcbiAgICAgICAgICBzdGF0dXNDb2RlOiBlLnN0YXR1c0NvZGUgPz8gNTAwLFxuICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgIG1lc3NhZ2U6IGUubWVzc2FnZSxcbiAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQ0E7O0FBS08sU0FBU0EsWUFBVCxDQUFzQkMsTUFBdEIsRUFBa0VDLE1BQWxFLEVBQWtGO0VBQ3JGO0VBRUE7RUFDQUQsTUFBTSxDQUFDRSxHQUFQLENBQVc7SUFDVEMsSUFBSSxFQUFFLGtDQURHO0lBRVRDLFFBQVEsRUFBRTtFQUZELENBQVgsRUFJ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