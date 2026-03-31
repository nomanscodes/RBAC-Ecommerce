import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "E-commerce API",
      version: "1.0.0",
      description:
        "A comprehensive e-commerce API with authentication, products, and categories management",
      contact: {
        name: "API Support",
        email: "support@ecommerce.com",
      },
    },
    servers: [
      {
        url: "http://localhost:4000",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter your JWT token",
        },
      },
      schemas: {
        Error: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
            },
            message: {
              type: "string",
              example: "Error message",
            },
          },
        },
        Pagination: {
          type: "object",
          properties: {
            currentPage: {
              type: "integer",
              example: 1,
            },
            perPage: {
              type: "integer",
              example: 10,
            },
            totalItems: {
              type: "integer",
              example: 50,
            },
            totalPages: {
              type: "integer",
              example: 5,
            },
            hasNextPage: {
              type: "boolean",
              example: true,
            },
            hasPreviousPage: {
              type: "boolean",
              example: false,
            },
          },
        },
        Product: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              example: 1,
            },
            name: {
              type: "string",
              example: "Laptop",
            },
            price: {
              type: "number",
              format: "float",
              example: 999.99,
            },
            categoryId: {
              type: "integer",
              nullable: true,
              example: 1,
            },
            image: {
              type: "string",
              nullable: true,
              example: "https://example.com/laptop.jpg",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
        Category: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              example: 1,
            },
            name: {
              type: "string",
              example: "Electronics",
            },
            description: {
              type: "string",
              nullable: true,
              example: "Electronic products and gadgets",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
        User: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              example: 1,
            },
            name: {
              type: "string",
              example: "John Doe",
            },
            email: {
              type: "string",
              format: "email",
              example: "john@example.com",
            },
          },
        },
      },
    },
    tags: [
      {
        name: "Authentication",
        description: "User authentication and registration",
      },
      {
        name: "Products",
        description: "Product management operations",
      },
      {
        name: "Categories",
        description: "Category management operations",
      },
      {
        name: "Users",
        description: "User management operations",
      },
    ],
  },
  apis: ["./routes/*.ts", "./controllers/*.ts"],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
