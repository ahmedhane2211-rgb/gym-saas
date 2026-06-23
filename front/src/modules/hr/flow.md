# HR Module

## Pages

* Employees
* Payroll
* Leaves
* Leaves & Permissions
* Investigations (Future)

---

# Employees

## Actions

* Create Employee
* Update Employee
* Delete Employee
* View Employee

## Data

* additional_salary
* address
* allowances
* basic_salary
* created_at
* date_of_joining
* description
* email
* health_insurance
* id
* job_number
* marital_status <!-- متزوج,مطلق,ارمل,عازب -->
* national_id
* nationality
* pending_debt
* phone
* plain_password
* qualification
* social_insurance
* tax
* total_salary
* type <!-- male,female -->
* user_id

## Business Rules

* الموظف غير النشط لا يظهر في أي Dropdown.
* الموظف غير النشط لا يتم احتساب راتبه.
* الموظف غير النشط لا يمكن إنشاء إذن أو إجازة له.
* يتم احتساب إجمالي الراتب من:

  * Basic Salary
  * Allowances
  * Additional Salary
  * Tax
  * Insurance

---

# Leaves

## Actions

* Create Leave Type
* Update Leave Type
* Delete Leave Type
* View Leave Type

## Data

* branch_id
* days
* type

## Examples

* Annual Leave
* Sick Leave
* Emergency Leave
* Marriage Leave

---

# Leaves & Permissions

## Actions

* Create Request
* Update Request
* Delete Request
* Approve Request
* Reject Request

## Data

* branch_id
* employee_id
* driver_id
* vacation_id
* type
* description
* image
* from
* to
* requested_days
* remaining_days
* from_time
* to_time
* date_permission
* requested_minutes
* status
* created_at
* updated_at

Relations:

* employee {}
* vacation {}

---

# Leave Flow

1. Employee creates leave request.
2. Request status = Pending.
3. Manager reviews request.
4. Manager approves or rejects.
5. If approved:

   * Requested days are deducted from leave balance.
   * Remaining days are recalculated.
6. If rejected:

   * No balance deduction.

## Rules

* Employee cannot request more than available leave balance.
* Employee can request fewer days than available.
* Remaining days = Leave Days - Approved Days.
* Leave balance is checked before approval.

---

# Permission Flow

1. Employee creates permission request.
2. Request status = Pending.
3. Manager approves or rejects.
4. If approved:

   * Permission is recorded in employee history.
5. If rejected:

   * No action is taken.

## Permission Types

* Late Arrival
* Early Leave
* Personal Permission
* Medical Permission

---

# Payroll

## Pages

* Payroll List
* Salary Details
* Salary History

## Salary Formula

Total Salary =
Basic Salary

* Allowances
* Additional Salary

- Tax
- Insurance
- Pending Debt

## Rules

* Only active employees are included in payroll.
* Payroll is generated monthly.
* Salary history must be preserved.
* Any deductions or bonuses are stored separately for audit purposes.

---

# Future Module

## Investigations

### Features

* Create Investigation
* Assign Employee
* Add Notes
* Attach Files
* Investigation Result
* Penalties
* Archive Investigation
