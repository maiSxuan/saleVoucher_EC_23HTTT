Build the Partner Portal and Admin Portal exactly following the provided prototype.

This is a business voucher marketplace platform.

The implementation must prioritize matching the prototype's structure, layout, spacing, interaction, navigation flow, and component hierarchy over introducing new designs.

Do NOT redesign anything.

Use the prototype as the single source of truth.

=========================================================
GENERAL DESIGN SYSTEM
=========================================================

Overall style:

- Clean SaaS dashboard
- Modern enterprise admin interface
- Flat design
- White cards
- Light gray page background
- Blue primary color
- Large spacing
- Minimal shadows
- Rounded corners
- Consistent typography

Layout:

Desktop-first.

Every authenticated page contains:

- Left collapsible sidebar
- Top navigation bar
- Main content area
- Breadcrumb when necessary

Cards:

- White background
- Rounded 12-16px
- Soft shadow
- 24px padding

Forms:

- Labels above inputs
- Large input fields
- Consistent spacing
- Validation below field
- Required fields marked

Tables:

- Search bar
- Filter row
- Status badges
- Action buttons
- Pagination

Status badges:

Gray
Green
Blue
Orange
Red
Purple

Use color only for status indication.

Buttons:

Primary:
Blue filled

Secondary:
White outlined

Danger:
Red

Success:
Green

Dialogs:

Confirmation modal

Reject modal

Approve modal

Delete modal

Success toast

Loading state

Skeleton when loading.

=========================================================
PARTNER MODULE
=========================================================

1.
Multi-step Partner Registration

Wizard interface.

Step indicator on top.

Steps:

Business information

Representative information

Business license upload

Branch information

Review

Submit

Every step validates before moving.

Back and Next buttons.

Progress preserved.

=========================================================

2.
Partner Profile

Display company profile.

Sections:

Business information

Representative

Tax information

Business license

Status

Allow editing.

Editing opens inline form.

Show pending update request.

Highlight changed fields.

Validation errors displayed below fields.

=========================================================

3.
Branch Management

List all branches.

Search.

Status badge.

Create branch.

Edit branch.

Delete branch.

Confirmation modal.

Branch detail includes:

Name

Address

Region

Phone

Business hours

Status

Support pending approval status.

=========================================================

4.
Voucher Creation

Large multi-section form.

Sections:

Basic information

Category

Price

Discount

Description

Images

Terms and conditions

Applicable branches

Selling period

Usage period

Quantity

Preview image

Validation before saving.

Can save as Draft.

=========================================================

5.
Voucher List

Table layout.

Columns:

Thumbnail

Voucher name

Category

Price

Status

Review status

Publication status

Quantity sold

Actions

Top filter:

Search

Status tabs

Category

Date

Actions:

View

Edit

Duplicate

Pause

Resume

Stop selling

Submit for review

=========================================================

6.
Voucher Detail

Large detail page.

Hero image.

Information card.

Business rules.

Applicable branches.

Voucher timeline.

Review history.

Current status.

Buttons depend on current workflow state.

=========================================================

7.
Submit for Approval

Confirmation modal.

Checklist shown before submit.

Cannot submit if validation fails.

Show loading.

Success toast.

=========================================================

8.
Approval Result

Timeline view.

Show:

Pending

Approved

Rejected

Need more information

Rejected reason displayed inside highlighted card.

=========================================================

9.
Partner Reports

Dashboard.

Cards:

Revenue

Orders

Sold vouchers

Used vouchers

Charts:

Revenue trend

Voucher performance

Top vouchers

Branch performance

Filters:

Date

Branch

Voucher

=========================================================
ADMIN MODULE
=========================================================

1.
Partner Applications

Table.

Search.

Filter.

Status.

Actions.

Columns:

Company

Representative

Tax code

Created date

Status

=========================================================

2.
Partner Detail

Tabbed layout.

Tabs:

Business profile

Representative

Documents

Branches

Approval history

Right side action panel.

Approve

Reject

Request more information

Lock

Unlock

Reject requires reason.

=========================================================

3.
Approve / Reject Partner

Confirmation dialog.

Reject dialog requires reason.

Success notification.

Immediately update status badge.

=========================================================

4.
Pending Voucher Review

Table.

Search.

Partner filter.

Category filter.

Review status filter.

Columns:

Voucher

Partner

Category

Selling period

Status

Review status

=========================================================

5.
Voucher Review Detail

Large detail page.

Preview image.

Business information.

Voucher information.

Price comparison.

Applicable branches.

Conditions.

Timeline.

Review checklist.

Reviewer notes.

Buttons:

Approve

Reject

Request modification

Reject requires selecting predefined reason or entering custom reason.

=========================================================
UX RULES
=========================================================

Never navigate unexpectedly.

Always preserve filters.

Keep scroll position.

Disable buttons while submitting.

Show spinner during API requests.

Optimistic updates only after success.

Every destructive action requires confirmation.

Every form has validation.

Every status change updates badge immediately.

=========================================================
IMPLEMENTATION RULES
=========================================================

Match the prototype as closely as possible.

Reuse identical layout hierarchy.

Reuse spacing rhythm.

Reuse card composition.

Reuse typography scale.

Reuse status colors.

Reuse sidebar organization.

Reuse page flow.

Do not simplify the workflow.

Do not invent additional pages.

Do not remove sections.

If any visual detail is unclear, prefer copying the prototype rather than creating a new design.