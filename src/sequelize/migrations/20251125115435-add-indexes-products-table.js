// src/sequelize/migrations/add-indexes-products-table.js

module.exports = {
  async up(queryInterface) {
    await queryInterface.addIndex('products', {
      name: 'idx_products_created_id',
      fields: [
        { name: 'createdAt', order: 'DESC' },
        { name: 'id', order: 'ASC' }
      ]
    });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex('products', 'idx_products_created_id');
  },
};