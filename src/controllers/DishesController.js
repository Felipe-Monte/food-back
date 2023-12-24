const knex = require("../database/knex")

class DishesController {
  // async create(request, response) {
  //   //coloque essa responsabilidade pro controller que recebe a imagem

  //   // const { title, description, price, tags } = request.body
  //   // const user_id = request.user.id

  //   // const [dishe_id] = await knex("dishes").insert({
  //   //   title,
  //   //   description,
  //   //   price,
  //   //   user_id
  //   // })

  //   // const tagsInsert = tags.map(name => {
  //   //   return {
  //   //     dishe_id,
  //   //     name,
  //   //     user_id
  //   //   }
  //   // })

  //   // await knex("tags").insert(tagsInsert)

  //   // return response.json()
  // }

  async show(request, response) {
    const { id } = request.params

    const dishe = await knex("dishes").where({ id }).first()
    const tags = await knex("tags").where({ dishe_id: id }).orderBy("name")

    return response.json({
      ...dishe,
      tags
    })
  }

  async delete(request, response) {
    const { id } = request.params

    await knex("dishes").where({ id }).delete()

    return response.json()
  }

  async index(request, response) {
    const { title, tags } = request.query

    const user_id = request.user.id

    let dishes

    if (tags) {
      const filterTags = tags.split(',').map(tag => tag.trim())

      dishes = await knex("tags")
        .select([
          "dishes.id",
          "dishes.title",
          "dishes.user_id",
        ])
        .where("dishes.user_id", user_id)
        .whereLike("dishes.title", `%${title}%`)
        .whereIn("name", filterTags)
        .innerJoin("dishes", "dishes.id", "tags.dishe_id")
        .orderBy("dishes.title")

    } else {
      dishes = await knex("dishes")
        .where({ user_id }) 
        .whereLike("title", `%${title}%`)
        .orderBy("title")
    }

    const userTags = await knex("tags").where({ user_id })
    const dishesWithTags = dishes.map(dishe => {
      const disheTags = userTags.filter(tag => tag.dishe_id === dishe.id)

      return {
        ...dishe,
        tags: disheTags
      }
    })

    return response.json(dishesWithTags)
  }
}

module.exports = DishesController