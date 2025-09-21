
export const load: PageLoad = async () => {
    return {
        users: [
            { id: "1", name: "Alex", avatar: "https://i.pravatar.cc/80?img=1", last: "See you soon!" },
            { id: "2", name: "Sam", avatar: "https://i.pravatar.cc/80?img=2", last: "Got it!" },
            { id: "3", name: "Riley", avatar: "https://i.pravatar.cc/80?img=3", last: "Haha yes" }
        ],
        messages: {
            "1": [
                { id: "m1", from: "me", text: "Hey Alex!", time: "10:02" },
                { id: "m2", from: "them", text: "Hey! How's your day?", time: "10:04" },
                { id: "m3", from: "me", text: "Pretty good – hike later?", time: "10:05" },
                { id: "m4", from: "them", text: "Totally. 5pm?", time: "10:06" }
            ],
            "2": [{ id: "m1", from: "them", text: "Ping me the address?", time: "09:50" }],
            "3": [{ id: "m1", from: "me", text: "Loved that set!", time: "Yesterday" }]
        }
    }
}