
## File & Module Naming

- **File Names:** Use kebab-case (lowercase, words separated by hyphens) and `.md` for documentation files.  
  - Example: `mongodb-styles.md`, `user-schema.js`
- **Module/Class Files:** Use PascalCase for files exporting a class or constructor; camelCase for utility modules.  
  - Example: `UserModel.js`, `mongo-utils.js`

## Collection Naming

- **Plural, lowercase:** Name collections in plural form, all lowercase, with words separated by underscores.  
  - Example: `users`, `order_items`
- **Avoid reserved words:** Do not use names like `admin` or `system` that may conflict with MongoDB internals.

## Field Naming

- **camelCase:** Use camelCase for document fields.  
  - Example: `firstName`, `orderDate`, `isActive`
- **No special characters:** Avoid dots (`.`), dollar signs (`$`), or spaces in field names.
- **Consistent booleans:** Prefix boolean fields with `is`, `has`, or `can`.  
  - Example: `isVerified`, `hasAddress`

## Schema Design & Modeling

- **Document size:** Keep documents under 16MB; embed only small, related sub-documents.  
- **Referencing vs. Embedding:**  
  - Embed for one-to-few relationships (e.g., address within user).  
  - Reference (ObjectId) for one-to-many or many-to-many to avoid document growth issues.
- **Schema Validation:** Use MongoDB’s JSON Schema validation to enforce required fields and types.

## Indexing Conventions

- **Naming indexes:** Use `<fields>_<order>_idx` format.  
  - Example: `email_1_idx` for an ascending index on `email`.
- **Index types:**  
  - Single-field indexes for equality filters.  
  - Compound indexes for multi-field queries; fields in the order of query predicates.  
- **TTL Indexes:** Use for time-based expiration with a clear naming suffix `_ttl`.

## Query & Command Style

- **Object literals:** Align key/value pairs, one per line for readability.  
  ```js
  db.users.find({
    isActive: true,
    age: { $gte: 18 }
  })
  ```
- **Projection:** Always specify projection to limit returned fields.  
  ```js
  db.orders.find({ status: 'shipped' }, { _id: 0, orderId: 1, total: 1 })
  ```

## Aggregation Pipeline Formatting

- **One stage per line:** Start each stage on its own line, with consistent indentation.  
  ```js
  db.sales.aggregate([
    { $match: { region: 'North America' } },
    { $group: { _id: '$productId', total: { $sum: '$amount' } } },
    { $sort: { total: -1 } }
  ])
  ```
- **Comments:** Annotate complex stages with inline comments.

## Transactions & Error Handling

- **Session management:** Pass the same session to all operations in a transaction.  
- **Retries:** Implement retry logic for transient transaction errors following MongoDB drivers’ recommendations.
- **Error logging:** Log detailed error messages including operation context and stack traces.

## Security & Access

- **Least privilege:** Grant minimal roles (e.g., `readWrite` on specific databases).  
- **IP whitelisting:** Restrict access to known IP ranges where possible.
- **Credential storage:** Use environment variables or secure vaults, never commit credentials to source control.

## Sample Code Snippet
```js
// Example: Creating a user document with Mongoose
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: String,
  email: { type: String, required: true, unique: true },
  isVerified: { type: Boolean, default: false }
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);

async function createUser(data) {
  try {
    const user = new User(data);
    return await user.save();
  } catch (err) {
    console.error('Error creating user:', err);
    throw err;
  }
}
```

*Consistency in naming, formatting, and structure helps teams collaborate efficiently and reduces bugs related to schema mismatches or query errors.*

