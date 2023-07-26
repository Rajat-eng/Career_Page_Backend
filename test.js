db.orders.aggregate( [
    {
       $lookup:
          {
            from: "warehouses",
            let: { order_item: "$item", order_qty: "$ordered" },
            pipeline: [
               { $match:
                  { $expr:
                     { $and:
                        [
                          { $eq: [ "$stock_item",  "$$order_item" ] },
                          { $eq: [ "$warehouse", "A" ] }
                        ]
                    }
                  }
               },
               { $project: { stock_item: 0, _id: 0 } }
            ],
            as: "stockdata"
          }
     }
 ] )