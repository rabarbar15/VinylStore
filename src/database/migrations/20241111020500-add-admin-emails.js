'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
    const admins = [
        {
            email: 'admin1@yourdomain.com',
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            email: 'admin2@yourdomain.com',
            createdAt: new Date(),
            updatedAt: new Date(),
        }
    ];
    await queryInterface.bulkInsert('Admin_users', admins);
}
export async function down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Admin_users', null, {});
}
