"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Button,
  Chip,
  Stack,
  Alert,
  CircularProgress,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Card,
  CardContent,
  Avatar,
  Grid,
  Divider,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Refresh as RefreshIcon,
  Email as EmailIcon,
  Person as PersonIcon,
  Message as MessageIcon,
  CalendarToday,
  Phone as PhoneIcon,
} from "@mui/icons-material";
import { createClient } from '@supabase/supabase-js';
import { IconSearch } from "@tabler/icons-react";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface ContactEntry {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  message: string;
  created_at: string;
  phone?: string;
}

const ContactEntriesPage = () => {
  const [entries, setEntries] = useState<ContactEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEntry, setSelectedEntry] = useState<ContactEntry | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  // Fetch Contact Entries from Supabase
  const fetchEntries = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: supabaseError } = await supabase
        .from("contact_us")
        .select("*")
        .order("created_at", { ascending: false });

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

      setEntries(data || []);
    } catch (err: any) {
      console.error("Error fetching contact entries:", err);
      setError(err.message || "Failed to fetch contact entries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  // Handle page change
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle delete confirmation
  const handleDeleteClick = (id: number) => {
    setEntryToDelete(id);
    setDeleteDialogOpen(true);
  };

  // Handle delete confirm
  const handleDeleteConfirm = async () => {
    if (!entryToDelete) return;

    try {
      const { error: supabaseError } = await supabase
        .from("contact_us")
        .delete()
        .eq("id", entryToDelete);

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

      // Refresh the list
      fetchEntries();
      setDeleteDialogOpen(false);
      setEntryToDelete(null);
    } catch (err: any) {
      console.error("Error deleting entry:", err);
      setError(err.message || "Failed to delete entry");
    }
  };

  // Handle view entry
  const handleView = (entry: ContactEntry) => {
    setSelectedEntry(entry);
    setViewDialogOpen(true);
  };

  // Filter entries based on search term
  const filteredEntries = entries.filter((entry) => {
    if (!searchTerm) return true;

    const searchLower = searchTerm.toLowerCase();
    return (
      entry.firstName?.toLowerCase().includes(searchLower) ||
      entry.lastName?.toLowerCase().includes(searchLower) ||
      entry.email?.toLowerCase().includes(searchLower) ||
      entry.message?.toLowerCase().includes(searchLower) ||
      entry.id.toString().includes(searchLower)
    );
  });

  // Calculate paginated data
  const paginatedEntries = filteredEntries.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1" fontWeight="bold">
            Contact Form Submissions
          </Typography>
          <Button
            variant="outlined"
            onClick={fetchEntries}
            startIcon={<RefreshIcon />}
            disabled={loading}
          >
            Refresh
          </Button>
        </Stack>

        {/* Search */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="body1" color="text.secondary">
            Showing {filteredEntries.length} of {entries.length} submissions
          </Typography>
          <TextField
            size="small"
            placeholder="Search by name, email, or message..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ width: 400 }}
            InputProps={{
              startAdornment: (
                <IconSearch style={{ marginRight: 8 }} />
              ),
            }}
          />
        </Stack>
      </Box>

      {/* Stats Cards */}
      {!loading && entries.length > 0 && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{xs:12, sm:6, md:4}}>
            <Card>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    <MessageIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6">{entries.length}</Typography>
                    <Typography variant="body2" color="text.secondary">Total Submissions</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{xs:12, sm:6, md:4}}>
            <Card>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar sx={{ bgcolor: 'success.main' }}>
                    <PersonIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6">
                      {entries.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">Total Contacts</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{xs:12, sm:6, md:4}}>
            <Card>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar sx={{ bgcolor: 'info.main' }}>
                    <EmailIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6">
                      {entries.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">Messages Received</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Loading State */}
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <Stack spacing={2} alignItems="center">
            <CircularProgress />
            <Typography color="text.secondary">Loading submissions...</Typography>
          </Stack>
        </Box>
      ) : (
        <>
          {/* Table */}
          <TableContainer component={Paper} elevation={2}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead sx={{ backgroundColor: 'primary.main' }}>
                <TableRow>
                  <TableCell><Typography fontWeight="bold" sx={{ color: 'white' }}>ID</Typography></TableCell>
                  <TableCell><Typography fontWeight="bold" sx={{ color: 'white' }}>Name</Typography></TableCell>
                  <TableCell><Typography fontWeight="bold" sx={{ color: 'white' }}>Email</Typography></TableCell>
                  <TableCell><Typography fontWeight="bold" sx={{ color: 'white' }}>Message</Typography></TableCell>
                  <TableCell><Typography fontWeight="bold" sx={{ color: 'white' }}>Date</Typography></TableCell>
                  <TableCell align="center"><Typography fontWeight="bold" sx={{ color: 'white' }}>Actions</Typography></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedEntries.length > 0 ? (
                  paginatedEntries.map((entry) => (
                    <TableRow
                      key={entry.id}
                      hover
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                        "&:hover": { backgroundColor: 'action.hover' },
                        backgroundColor: 'white',
                      }}
                    >
                      {/* ID Column */}
                      <TableCell>
                        <Typography variant="body2" fontWeight="bold" color="primary">
                          #{entry.id}
                        </Typography>
                      </TableCell>

                      {/* Name Column */}
                      <TableCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <PersonIcon fontSize="small" color="action" />
                          <Typography variant="body2">
                            {entry.firstName} {entry.lastName}
                          </Typography>
                        </Stack>
                      </TableCell>

                      {/* Email Column */}
                      <TableCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <EmailIcon fontSize="small" color="action" />
                          <Typography variant="body2">{entry.email}</Typography>
                        </Stack>
                      </TableCell>

                      {/* Message Column */}
                      <TableCell>
                        <Typography variant="body2" sx={{ maxWidth: 250 }}>
                          {entry.message.length > 50 
                            ? `${entry.message.substring(0, 50)}...` 
                            : entry.message}
                        </Typography>
                      </TableCell>

                      {/* Date Column */}
                      <TableCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <CalendarToday fontSize="small" color="action" />
                          <Typography variant="caption">
                            {formatDate(entry.created_at)}
                          </Typography>
                        </Stack>
                      </TableCell>

                      {/* Actions Column */}
                      <TableCell align="center">
                        <Stack direction="row" spacing={1} justifyContent="center">
                          <Tooltip title="View Details">
                            <IconButton
                              size="small"
                              color="info"
                              onClick={() => handleView(entry)}
                            >
                              <ViewIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDeleteClick(entry.id)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                      {searchTerm ? (
                        <Stack spacing={2} alignItems="center">
                          <Typography variant="h6" color="text.secondary">
                            No submissions found matching "{searchTerm}"
                          </Typography>
                          <Button
                            variant="outlined"
                            onClick={() => setSearchTerm("")}
                          >
                            Clear Search
                          </Button>
                        </Stack>
                      ) : (
                        <Stack spacing={2} alignItems="center">
                          <Typography variant="h6" color="text.secondary">
                            No contact form submissions yet
                          </Typography>
                        </Stack>
                      )}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          {filteredEntries.length > 0 && (
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50]}
              component="div"
              count={filteredEntries.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{ mt: 2 }}
            />
          )}
        </>
      )}

      {/* View Details Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedEntry && (
          <>
            <DialogTitle>
              <Typography variant="h6">Contact Form Details #{selectedEntry.id}</Typography>
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={3}>
                {/* Personal Information */}
                <Grid size={{xs:12}}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Personal Information
                  </Typography>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Grid container spacing={2}>
                      <Grid size={{xs:12, sm:6}}>
                        <Typography variant="caption" color="text.secondary">
                          First Name
                        </Typography>
                        <Typography variant="body1">{selectedEntry.firstName}</Typography>
                      </Grid>
                      <Grid size={{xs:12, sm:6}}>
                        <Typography variant="caption" color="text.secondary">
                          Last Name
                        </Typography>
                        <Typography variant="body1">{selectedEntry.lastName}</Typography>
                      </Grid>
                      <Grid size={{xs:12}}>
                        <Typography variant="caption" color="text.secondary">
                          Email Address
                        </Typography>
                        <Typography variant="body1">{selectedEntry.email}</Typography>
                      </Grid>
                      {selectedEntry.phone && (
                        <Grid size={{xs:12}}>
                          <Typography variant="caption" color="text.secondary">
                            Phone Number
                          </Typography>
                          <Typography variant="body1">{selectedEntry.phone}</Typography>
                        </Grid>
                      )}
                    </Grid>
                  </Paper>
                </Grid>

                {/* Message */}
                <Grid size={{xs:12}}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Message
                  </Typography>
                  <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                      {selectedEntry.message}
                    </Typography>
                  </Paper>
                </Grid>

                {/* Metadata */}
                <Grid size={{xs:12}}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Submission Details
                  </Typography>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Stack spacing={1}>
                      <Stack direction="row" spacing={2}>
                        <Typography variant="caption" color="text.secondary" sx={{ minWidth: 100 }}>
                          Submitted on:
                        </Typography>
                        <Typography variant="body2">
                          {formatDate(selectedEntry.created_at)}
                        </Typography>
                      </Stack>
                      <Stack direction="row" spacing={2}>
                        <Typography variant="caption" color="text.secondary" sx={{ minWidth: 100 }}>
                          Entry ID:
                        </Typography>
                        <Typography variant="body2">#{selectedEntry.id}</Typography>
                      </Stack>
                    </Stack>
                  </Paper>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
              <Button
                variant="contained"
                color="primary"
                startIcon={<EmailIcon />}
                href={`mailto:${selectedEntry.email}`}
                target="_blank"
              >
                Reply via Email
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this contact form submission? This action cannot be undone.
          </Typography>
          <Alert severity="warning" sx={{ mt: 2 }}>
            This will permanently remove this entry from the database.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete Entry
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ContactEntriesPage;