CREATE TABLE combos(
	id UUID PRIMARY KEY,
    main UUID NOT NULL,
    side UUID,
    sauce UUID,
    soup UUID,
    protein UUID,
    FOREIGN KEY (main)
        REFERENCES products (id),
    FOREIGN KEY (side)
        REFERENCES products (id),
    FOREIGN KEY (sauce)
        REFERENCES products (id),
    FOREIGN KEY (soup)
        REFERENCES products (id),
    FOREIGN KEY (protein)
        REFERENCES products (id),
    UNIQUE(main, side, sauce, soup, protein)
);

CREATE TYPE status AS ENUM ('pending', 'paid', 'delivered');
CREATE TABLE orders(
	id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    status status default 'pending',
    createdAt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cart_item(
    order_id INTEGER NOT NULL,
    product_id UUID NOT NULL,
    quantity INTEGER NOT NULL,
    FOREIGN KEY(order_id)
        REFERENCES orders (id),
    FOREIGN KEY(product_id)
        REFERENCES products (id),
    CHECK(quantity > 0)
);

CREATE TABLE users_payment(
    user_id UUID PRIMARY KEY,
    payment_id VARCHAR(256),
    FOREIGN KEY (user_id)
        REFERENCES users (id)
);