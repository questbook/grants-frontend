enum TableFilters {
//   All = -1,
//   Pending_Review = 0,
//   Approved = 1,
//   Rejected = 2,
//   Awaiting_Resubmit = 3,
//   Completed = 4,
  'all' = -1,
  'submitted' = 0,
  'resubmit' = 1,
  'approved' = 2,
  'rejected' = 3,
  'completed' = 4,
  'assigned' = 5,
}

enum TableFilterNames {
  'all' = 'All',
  'submitted' = 'Pending Review',
  'resubmit' = 'Awaiting Resubmit',
  'approved' = 'Approved',
  'rejected' = 'Rejected',
  'completed' = 'Closed',
  'assigned' = 'Assigned to review',
}

export { TableFilters, TableFilterNames };
