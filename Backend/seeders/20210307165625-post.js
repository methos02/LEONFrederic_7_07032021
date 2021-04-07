'use strict';
const typePost = require('../helpers/postType');

module.exports = {
    up: async (queryInterface) => {
        await queryInterface.bulkInsert('posts', [{
            title: 'Premier Post',
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam a nisi bibendum, suscipit est at, faucibus est. Donec luctus at quam ac sagittis. Proin in consectetur augue, sagittis faucibus neque. In hac habitasse platea dictumst. Sed ultricies, mauris ut dapibus tristique, eros arcu rutrum libero, a faucibus augue libero eget erat. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Mauris vitae est orci.\n' +
                '\n' +
                'Nulla sed quam sit amet mi tempor porta eu nec nunc. Aenean volutpat et nisl vel pharetra. Ut pulvinar sapien commodo mi aliquet, sed vestibulum augue ultrices. Proin vitae lacinia erat. Donec mattis est et tempus viverra. Aenean et mattis nunc. Suspendisse ut velit turpis. Integer suscipit mi libero, nec pharetra sem viverra sit amet. Nullam tempor suscipit tortor, sit amet euismod ex venenatis quis. Praesent et venenatis mi. Vivamus pretium massa sit amet metus suscipit faucibus.\n' +
                '\n' +
                'Nam gravida tortor vel dolor euismod condimentum. Nam tempus porta magna, eu sagittis neque ultrices quis. In ac mi ac urna scelerisque pharetra id gravida purus. Cras lacus eros, vehicula id pharetra quis, egestas nec orci. Duis tristique tempus rutrum. Sed pulvinar porttitor arcu, non finibus ante placerat imperdiet. Nullam nibh purus, congue vel ligula non, elementum mollis turpis.\n' +
                '\n' +
                'Sed semper leo vitae sem consectetur, finibus pulvinar ante convallis. Quisque pellentesque pellentesque varius. Sed sodales suscipit justo, blandit congue mauris iaculis vel. Fusce et velit ut nisl vehicula consequat eu nec sapien. Sed in fringilla augue, sit amet facilisis mauris. Vestibulum egestas arcu id elit efficitur pulvinar et non nibh. Sed non ornare lacus.\n' +
                '\n' +
                'Mauris lorem quam, interdum vel nibh id, ullamcorper tempus augue. In massa nisi, interdum eget suscipit non, euismod ut purus. Nam accumsan, neque sed dictum molestie, purus nibh sollicitudin elit, eget tempus velit eros id risus. Sed sagittis bibendum sem, nec fermentum orci sollicitudin eu. Vivamus ut cursus quam. Maecenas congue quam eu massa congue commodo. Ut aliquet euismod nulla, vel bibendum libero feugiat sed. Nullam cursus sapien cursus mi maximus, eget varius tellus pharetra. Maecenas eget vestibulum lorem, eu tincidunt dolor. Sed ultrices dui sed arcu pharetra venenatis.',
            UserId: 1,
            like: 1,
            type: typePost.ARTICLE.id
        },{
            title: 'Second Post',
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam a nisi bibendum, suscipit est at, faucibus est. Donec luctus at quam ac sagittis. Proin in consectetur augue, sagittis faucibus neque. In hac habitasse platea dictumst. Sed ultricies, mauris ut dapibus tristique, eros arcu rutrum libero, a faucibus augue libero eget erat. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Mauris vitae est orci.\n' +
                '\n' +
                'Nulla sed quam sit amet mi tempor porta eu nec nunc. Aenean volutpat et nisl vel pharetra. Ut pulvinar sapien commodo mi aliquet, sed vestibulum augue ultrices. Proin vitae lacinia erat. Donec mattis est et tempus viverra. Aenean et mattis nunc. Suspendisse ut velit turpis. Integer suscipit mi libero, nec pharetra sem viverra sit amet. Nullam tempor suscipit tortor, sit amet euismod ex venenatis quis. Praesent et venenatis mi. Vivamus pretium massa sit amet metus suscipit faucibus.\n' +
                '\n' +
                'Nam gravida tortor vel dolor euismod condimentum. Nam tempus porta magna, eu sagittis neque ultrices quis. In ac mi ac urna scelerisque pharetra id gravida purus. Cras lacus eros, vehicula id pharetra quis, egestas nec orci. Duis tristique tempus rutrum. Sed pulvinar porttitor arcu, non finibus ante placerat imperdiet. Nullam nibh purus, congue vel ligula non, elementum mollis turpis.\n' +
                '\n' +
                'Sed semper leo vitae sem consectetur, finibus pulvinar ante convallis. Quisque pellentesque pellentesque varius. Sed sodales suscipit justo, blandit congue mauris iaculis vel. Fusce et velit ut nisl vehicula consequat eu nec sapien. Sed in fringilla augue, sit amet facilisis mauris. Vestibulum egestas arcu id elit efficitur pulvinar et non nibh. Sed non ornare lacus.\n' +
                '\n' +
                'Mauris lorem quam, interdum vel nibh id, ullamcorper tempus augue. In massa nisi, interdum eget suscipit non, euismod ut purus. Nam accumsan, neque sed dictum molestie, purus nibh sollicitudin elit, eget tempus velit eros id risus. Sed sagittis bibendum sem, nec fermentum orci sollicitudin eu. Vivamus ut cursus quam. Maecenas congue quam eu massa congue commodo. Ut aliquet euismod nulla, vel bibendum libero feugiat sed. Nullam cursus sapien cursus mi maximus, eget varius tellus pharetra. Maecenas eget vestibulum lorem, eu tincidunt dolor. Sed ultrices dui sed arcu pharetra venenatis.',
            UserId: 1,
            like: 0,
            type: typePost.ARTICLE.id
        },{
            title: null,
            content: null,
            image: 'post_3.webp',
            UserId: 2,
            like: 0,
            type: typePost.IMAGE.id
        }], {});
    },

    down: async (queryInterface) => {
        await queryInterface.bulkDelete('posts', null, {});
    }
};
