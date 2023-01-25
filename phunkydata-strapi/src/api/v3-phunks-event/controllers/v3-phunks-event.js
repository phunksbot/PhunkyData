'use strict';

/**
 * v3-phunks-event controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::v3-phunks-event.v3-phunks-event', ({ strapi }) => ({

    async find() {
      return { "message" : "This route is not available, please query a single record. i.e. {api}/{:id}" };
    },
  
    async findOne(ctx) {
        const { id } = ctx.params;
        if (id > 9999 || id < 0) return { "message" : "Invalid token id"};

        const fetch = require('node-fetch');
        const url = 'https://api.looksrare.org/api/v1/events?collection=0xb7D405BEE01C70A9577316C1B9C2505F146e8842&tokenId=' + String(id);
        const options = {method: 'GET', headers: {accept: 'application/json'}};
        const response = await fetch(url, options);
        

        if (response.ok) {
            const data = await response.json();
            const events = data['data'];

            console.log(events)

            var event_data = [];
            for (const event of events) {
                const parsed_json = {
                    "from" : event.from,
                    "to" : event.to,
                    "type" : event.type,
                    "hash" : event.hash,
                    "createdAt" : event.createdAt
                };
                event_data.push(parsed_json);
            }

            console.log(event_data)

            const processed_data = {
                "tokenId" : id,
                "events" : event_data,
                "attribution" : "Data sourced from Looksrare Public API; use of this for non-personal reason must be attributed in accordance with their policies.",
                "attribution_link" : "https://docs.looksrare.org/developers/public-api-documentation"
            }

            return processed_data;

        } else {
            return { "message" : "Issue Accessing Looksrare API" }
        }
        
    },
  
  }));
  