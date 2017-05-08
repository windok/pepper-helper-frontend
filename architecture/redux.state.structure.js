const state = {
    menubar: {
        title: "Product list default name",
        showSidebar: true,
        showBackButton: true,
        showShareButton: true,
        showSettingButton: true
    },
    measurementUnits: {
        1: {
            id: 1,
            name: "kg",
            format: "float"
        },
        4: {
            id: 4,
            name: "bottle",
            format: "int"
        },
        5: {
            id: 5,
            name: "loaf",
            format: "int"
        }
    },
    user: {
        name: "John",
        lastName: "Doe",
        avatar: "http://url"
    },
    productLists: {
        15: {
            id: 15,
            name: "default",
            listItems: [
                {
                    id: 2000,
                    listId: 15,
                    productId: 77,
                    productName: "Bread",
                    groupId: 75,
                    groupName: "Bakery",
                    measurementUnitId: 5,
                    status: "draft",
                    quantity: 1
                }
            ]
        }
    }
};