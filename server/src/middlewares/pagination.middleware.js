export const pagination =
  async (getData, countData) => async (req, res, next) => {
    // Early exit if there is no pagination to be made
    if (!req.query.page || !req.query.limit) next();

    // Page and limit parameters
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);

    // Other optional parameters
    const title = req.query.title || undefined;

    // Indexes for searching data correctly
    const offset = (page - 1) * limit;

    // Needed data is search in a parallel way
    const [data, length] = await Promise.all([
      getData(limit, offset, title),
      countData(),
    ]);

    // Pagination object is built
    const pagination = {
      currentPage: page,
      totalPages: Math.ceil(length / limit),
      totalItems: length,
      hasMore: page * limit < length,
    };

    // Data and pagination is returned
    res.pagination = pagination;
    res.paginationResults = data;
    next();
  };
