enum TableFilters {
//   All = -1,
//   Pending_Review = 0,
//   Approved = 1,
//   Rejected = 2,
//   Awaiting_Resubmit = 3,
//   Completed = 4,
  'submitted' = 'In Review',
  'resubmit' = 'Awaiting Resubmission',
  'approved' = 'Accepted',
  'rejected' = 'Rejected',
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

export { TableFilters, TableFilterNames }
