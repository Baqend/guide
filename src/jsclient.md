# JS Client

## API

```javascript
/**
   * Determine whether the entity manager is open.
   * @type {Boolean} true until the entity manager has been closed
   */
  isOpen: { ... },

  /**
   * @constructor
   * @param {jspa.EntityManagerFactory} entityManagerFactory
   */
  initialize: function (entityManagerFactory) { ... },

  /**
   * Get an instance, whose state may be lazily fetched. If the requested instance does not exist
   * in the database, the EntityNotFoundError is thrown when the instance state is first accessed.
   * The application should not expect that the instance state will be available upon detachment,
   * unless it was accessed by the application while the entity manager was open.
   *
   * @param {(Function|String)} entityClass
   * @param {String=} oid
   */
  getReference: function (entityClass, oid) { ... },

  /**
   * Create an instance of Query or TypedQuery for executing a query language statement.
   * if the optional resultClass argument is provided, the select list of the query must contain
   * only a single item, which must be assignable to the type specified by the resultClass argument.
   *
   * @param {String|Object} qlString - a query string
   * @param {String|Function=} resultClass - the optional type of the query result
   */
  createQuery: function (qlString, resultClass) { ... },

  /**
   * Clear the persistence context, causing all managed entities to become detached.
   * Changes made to entities that have not been flushed to the database will not be persisted.
   */
  clear: function (doneCallback, failCallback) { ... },

  /**
   * Close an application-managed entity manager. After the close method has been invoked,
   * all methods on the EntityManager instance and any Query and TypedQuery objects obtained from it
   * will throw the IllegalStateError except for transaction, and isOpen (which will return false).
   * If this method is called when the entity manager is associated with an active transaction,
   * the persistence context remains managed until the transaction completes.
   */
  close: function (doneCallback, failCallback) { ... },

  /**
   * Check if the instance is a managed entity instance belonging to the current persistence context.
   * @param {Object} entity - entity instance
   * @returns {Boolean} boolean indicating if entity is in persistence context
   */
  contains: function (entity) { ... },

  /**
   * Remove the given entity from the persistence context, causing a managed entity to become detached.
   * Unflushed changes made to the entity if any (including removal of the entity),
   * will not be synchronized to the database. Entities which previously referenced the detached entity
   * will continue to reference it.
   * @param {Object} entity - entity instance
   */
  detach: function (entity, doneCallback, failCallback) { ... },

  /**
   * Find by object ID. Search for an entity of the specified oid.
   * If the entity instance is contained in the persistence context, it is returned from there.
   * @param {(Function|String)} entityClass - entity class
   * @param {String=} oid - Object ID
   * @param {Function=} doneCallback
   * @param {function=} failCallback
   */
  find: function (entityClass, oid, doneCallback, failCallback) { ... },

  /**
   * Synchronize the persistence context to the underlying database.
   *
   * @returns {jspa.Promise}
   */
  flush: function (doneCallback, failCallback) { ... },

  /**
   * Merge the state of the given entity into the current persistence context.
   *
   * @param {*} entity - entity instance
   * @return {jspa.Promise} the promise will be called with the managed instance that the state was merged to
   */
  merge: function (entity, doneCallback, failCallback) { ... },

  /**
   * Make an instance managed and persistent.
   * @param {Object} entity - entity instance
   */
  persist: function (entity, doneCallback, failCallback) { ... },

  /**
   * Refresh the state of the instance from the database, overwriting changes made to the entity, if any.
   * @param {Object} entity - entity instance
   */
  refresh: function (entity, doneCallback, failCallback) { ... },

  /**
   * Remove the entity instance.
   * @param {Object} entity - entity instance
   */
  remove: function (entity, doneCallback, failCallback) { ... },
```
