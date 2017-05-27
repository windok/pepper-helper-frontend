const state = {
    ui: {
        menubar: {
            title: "Product list default name",
            showSidebar: true,
            showBackButton: true,
            showShareButton: true,
            showSettingButton: true
        },
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
            listItems: [2000]
        }
    },
    listItems: {
        2000: {
            "id": 1,
            "listId": 1,
            "translationId": 1,
            "unitId": 1,
            "status": "draft",
            "groupId": 1,
            "quantity": "1",
            "type": "general",
            "date": "2017-05-27 13:21:13"
        }
    }
};

