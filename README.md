
## Tours and Travel API Project
The **Tours and Travel API Project** is a backend system designed for managing and booking travel tours, supporting three roles: **Admin**, **Moderator**, and **Users**. Admins have full control, including adding, updating, and deleting tours, as well as managing moderators and overseeing bookings. Moderators assist admins by reviewing and approving tours before they are published, ensuring quality and compliance. Users can browse available tours using filters like destination, price, and dates, view detailed tour information, and book tours seamlessly. Built using Node.js, Express.js, and MongoDB, the system employs JWT-based authentication for secure role-based access control. This API provides a reliable and efficient solution for managing travel services.

**user api**

- /api/v1/users/login - POST
- /api/v1/users/me - GET
- /api/v1/users/deleteMe - DELETE
- /api/v1/users/updateMe - PATCH
- /api/v1/users - GET
- /api/v1/users/role - GET
- /api/v1/users/:id - GET
- /api/v1/users/:id - PATCH
- /api/v1/users/:id - DELETE
- /api/v1/users/signup - POST

**tours api**

- /api/v1/tours - GET
- /api/v1/tours/:id - GET
- /api/v1/tours - POST
- /api/v1/tours/:id - PATCH
- /api/v1/tours/:id - DELETE
- /api/v1/tours/destinations - GET
- /api/v1/tours/travelStyle - GET

**reviews api**

- /api/v1/tours/:tourId/reviews - GET
- /api/v1/reviews  - GET
- /api/v1/reviews/:id - GET
- /api/v1/reviews - POST
- /api/v1/reviews/:id - PATCH
- /api/v1/reviews/:id - DELETE