import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  FolderKanban, 
  Clock, 
  AlertCircle, 
  RefreshCw,
  Mail,
  MoreVertical,
  Award,
  CheckSquare,
  Calendar,
  Edit2,
  Trash2,
  Eye,
  ChevronDown,
  Check,
  Loader2,
  Plus,
  Sparkles,
  Tag,
  Send,
  XCircle,
  RotateCw,
  MailX,
  CheckCircle2,
  ShieldAlert,
  X
} from 'lucide-react';
import ProjectService from '../services/project.service';
import UserService from '../services/user.service';
import TaskService from '../services/task.service';
import InvitationService from '../services/invitation.service';
import Modal from '../components/ui/Modal';
import Toast from '../components/ui/Toast';

// Predefined Role-to-Skills Mapping
const ROLE_SKILL_MAPPING = {
  fullstack: ['React', 'Node.js', 'Python', 'Django', 'REST API', 'PostgreSQL', 'Git'],
  frontend: ['React', 'JavaScript', 'TypeScript', 'HTML', 'CSS', 'Tailwind CSS', 'Next.js'],
  backend: ['Python', 'Django', 'REST API', 'PostgreSQL', 'Docker', 'Git', 'Redis'],
  ml: ['Python', 'Pandas', 'NumPy', 'Scikit-learn', 'TensorFlow', 'XGBoost', 'PyTorch'],
  tester: ['Selenium', 'Cypress', 'Postman', 'JUnit', 'QA Automation', 'API Testing'],
  designer: ['Figma', 'Wireframing', 'Prototyping', 'UI Design', 'UX Research'],
};

// Reusable Normalized Skill Helpers
const addSkillNormalized = (currentSkills, suggestedList, rawInput) => {
  const clean = (rawInput || '').trim();
  if (!clean) return currentSkills;
  const lower = clean.toLowerCase();

  const match = suggestedList.find(s => s.toLowerCase() === lower);
  if (match) {
    const alreadySelected = currentSkills.some(s => s.toLowerCase() === lower);
    if (!alreadySelected) {
      return [...currentSkills, match];
    }
    return currentSkills;
  }

  const exists = currentSkills.some(s => s.toLowerCase() === lower);
  if (!exists) {
    return [...currentSkills, clean];
  }
  return currentSkills;
};

const toggleSuggestedSkillNormalized = (currentSkills, skillName) => {
  const lower = skillName.toLowerCase();
  const exists = currentSkills.some(s => s.toLowerCase() === lower);
  if (exists) {
    return currentSkills.filter(s => s.toLowerCase() !== lower);
  } else {
    return [...currentSkills, skillName];
  }
};

const removeCustomSkillNormalized = (currentSkills, skillName) => {
  const lower = skillName.toLowerCase();
  return currentSkills.filter(s => s.toLowerCase() !== lower);
};

const Teams = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('all');
  const [members, setMembers] = useState([]);
  const [allSystemUsers, setAllSystemUsers] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Search & Sort
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name'); // name, experience, availability, tasks, joined

  // Action Menu state
  const [activeMenuId, setActiveMenuId] = useState(null);

  // Add Member Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addProjectId, setAddProjectId] = useState('');
  const [addUserId, setAddUserId] = useState('');
  const [addRole, setAddRole] = useState('fullstack');
  const [selectedSkills, setSelectedSkills] = useState(ROLE_SKILL_MAPPING.fullstack);
  const [customSkillInput, setCustomSkillInput] = useState('');
  const [roleChangePrompt, setRoleChangePrompt] = useState(null); // { newRole, oldSkills }

  // Searchable Combobox State for Add Member
  const [isComboboxOpen, setIsComboboxOpen] = useState(false);
  const [comboboxSearch, setComboboxSearch] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const comboboxRef = useRef(null);

  // Edit Role & Skills Modal State
  const [isEditRoleModalOpen, setIsEditRoleModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [editRole, setEditRole] = useState('fullstack');
  const [editSkills, setEditSkills] = useState([]);
  const [editCustomSkillInput, setEditCustomSkillInput] = useState('');

  // View Profile Modal State
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileMember, setProfileMember] = useState(null);

  // Team Directory vs Invitations Tab
  const [activeDirectoryTab, setActiveDirectoryTab] = useState('members'); // 'members' | 'invitations'
  const [invitations, setInvitations] = useState([]);
  const [invitationStatusFilter, setInvitationStatusFilter] = useState('all');

  // Add Member Modal Tab: 'existing' vs 'invite'
  const [addMemberTab, setAddMemberTab] = useState('existing');

  // Invite New Member Form State
  const [inviteFullName, setInviteFullName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('fullstack');
  const [inviteSkills, setInviteSkills] = useState(ROLE_SKILL_MAPPING.fullstack);
  const [inviteCustomSkill, setInviteCustomSkill] = useState('');
  const [inviteMessage, setInviteMessage] = useState('');

  // Action loading state for resend/cancel
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // Submissions & Errors
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  // Invitation UX enhancements: Highlighting, Cooldown Timer & Callouts
  const [highlightedInvitationId, setHighlightedInvitationId] = useState(null);
  const [existingPendingInv, setExistingPendingInv] = useState(null);
  const [cooldownTimers, setCooldownTimers] = useState({});

  // Countdown Ticker (1 second interval) for active resend cooldowns
  useEffect(() => {
    const hasActive = Object.values(cooldownTimers).some(secs => secs > 0);
    if (!hasActive) return;

    const interval = setInterval(() => {
      setCooldownTimers(prev => {
        const next = { ...prev };
        let changed = false;
        Object.keys(next).forEach(id => {
          if (next[id] > 0) {
            next[id] = next[id] - 1;
            changed = true;
          }
        });
        return changed ? next : prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [cooldownTimers]);

  // Calculate remaining cooldown seconds for an invitation
  const getRemainingCooldown = useCallback((inv) => {
    if (!inv) return 0;
    const invId = inv.id;
    if (invId && cooldownTimers[invId] !== undefined) {
      return Math.max(0, cooldownTimers[invId]);
    }
    const lastTimeStr = inv.last_resent_at || inv.created_at;
    if (!lastTimeStr) return 0;
    const elapsedSecs = (Date.now() - new Date(lastTimeStr).getTime()) / 1000;
    if (elapsedSecs > 0 && elapsedSecs < 300) {
      return Math.ceil(300 - elapsedSecs);
    }
    return 0;
  }, [cooldownTimers]);

  // Format remaining seconds into M:SS (e.g. 286 -> 4:46)
  const formatCooldownTime = (totalSeconds) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Toast
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    console.log('[RESEND TRACE: BEFORE TOAST]', { message, type });
    setToast({ message, type });
    console.log('[RESEND TRACE: AFTER TOAST] Toast set in state');
  };

  // Helper to parse backend errors into user-friendly messages
  const parseInvitationError = (err, invitationId = null) => {
    let raw = '';
    if (Array.isArray(err.response?.data) && err.response.data.length > 0) {
      raw = err.response.data[0];
    } else if (typeof err.response?.data === 'string') {
      raw = err.response.data;
    } else if (err.response?.data?.detail) {
      raw = typeof err.response.data.detail === 'string' ? err.response.data.detail : JSON.stringify(err.response.data.detail);
    } else if (err.response?.data?.error) {
      raw = typeof err.response.data.error === 'string' ? err.response.data.error : JSON.stringify(err.response.data.error);
    } else if (err.response?.data?.email) {
      raw = Array.isArray(err.response.data.email) ? err.response.data.email[0] : err.response.data.email;
    } else if (err.message) {
      raw = err.message;
    }

    const rawLower = (raw || '').toLowerCase();

    // Check for rate limit wait error pattern: "Please wait Xm Ys before resending..."
    const rateMatch = (raw || '').match(/(\d+)m\s*(\d+)s/i);
    if (rateMatch) {
      const mins = parseInt(rateMatch[1], 10);
      const secs = parseInt(rateMatch[2], 10);
      const totalRemainingSecs = mins * 60 + secs;
      if (invitationId) {
        setCooldownTimers(prev => ({ ...prev, [invitationId]: totalRemainingSecs }));
      }
      return {
        type: 'rate_limit',
        remainingSecs: totalRemainingSecs,
        message: `Please wait ${mins}:${secs < 10 ? '0' : ''}${secs} before resending this invitation.`,
        raw
      };
    }

    if (rawLower.includes('pending invitation already exists') || rawLower.includes('already sent')) {
      return {
        type: 'duplicate_pending',
        message: 'A pending invitation has already been sent to this email.',
        raw
      };
    }

    if (rawLower.includes('already a member') || rawLower.includes('already member')) {
      return {
        type: 'already_member',
        message: 'This user is already a member of this project.',
        raw
      };
    }

    if (rawLower.includes('valid email') || rawLower.includes('enter a valid email')) {
      return {
        type: 'invalid_email',
        message: 'Please enter a valid email address.',
        raw
      };
    }

    return {
      type: 'generic',
      message: raw || 'Failed to process invitation. Please check inputs and try again.',
      raw
    };
  };

  // Title Case converter for clean Project Titles
  const toTitleCase = (str) => {
    if (!str) return '';
    return str
      .split(' ')
      .map(w => w ? w.charAt(0).toUpperCase() + w.slice(1) : '')
      .join(' ');
  };

  // Helper to format clean display name from user object or member record
  const getDisplayName = (userObj) => {
    if (!userObj) return 'Team Member';
    const first = userObj.first_name || '';
    const last = userObj.last_name || '';
    const full = `${first} ${last}`.trim();
    if (full) return full;
    
    // Fallback: nicely format handle usernames into Title Case
    const raw = userObj.username || 'Member';
    const clean = raw.replace(/[0-9_]/g, ' ').trim();
    if (clean.length > 2) {
      return clean.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    }
    return raw;
  };

  const fetchTeamData = useCallback(async () => {
    await Promise.resolve();
    setIsLoading(true);
    setError(null);
    try {
      const [projectsData, usersData, tasksData] = await Promise.all([
        ProjectService.getProjects(),
        UserService.getUsers().catch(() => []),
        TaskService.getTasks().catch(() => [])
      ]);
      setProjects(projectsData);
      setAllSystemUsers(usersData);
      setAllTasks(tasksData);

      const userMap = {};
      (usersData || []).forEach(u => { userMap[u.id] = u; });

      let aggregatedMembers = [];
      if (selectedProjectId === 'all') {
        const memberPromises = projectsData.map(p => 
          ProjectService.getProjectMembers(p.id).then(mList => 
            mList.map(m => {
              const u = userMap[m.user] || {};
              const memberRoleKey = (m.role || 'developer').toLowerCase();
              const defaultRoleSkills = ROLE_SKILL_MAPPING[memberRoleKey] || ROLE_SKILL_MAPPING.developer;
              return { 
                ...m, 
                projectName: p.title,
                first_name: m.first_name || u.first_name || '',
                last_name: m.last_name || u.last_name || '',
                user_email: m.user_email || u.email || `${m.username}@fairsplit.com`,
                experience: m.experience ?? u.experience ?? 2,
                availability_hours: m.availability_hours ?? u.availability_hours ?? 40,
                profile_picture: m.profile_picture || u.profile_picture || null,
                skills: (Array.isArray(m.skills) && m.skills.length > 0) ? m.skills : defaultRoleSkills
              };
            })
          ).catch(() => [])
        );
        const results = await Promise.all(memberPromises);
        aggregatedMembers = results.flat();
      } else {
        const proj = projectsData.find(p => p.id.toString() === selectedProjectId);
        const mList = await ProjectService.getProjectMembers(selectedProjectId);
        aggregatedMembers = mList.map(m => {
          const u = userMap[m.user] || {};
          const memberRoleKey = (m.role || 'developer').toLowerCase();
          const defaultRoleSkills = ROLE_SKILL_MAPPING[memberRoleKey] || ROLE_SKILL_MAPPING.developer;
          return { 
            ...m, 
            projectName: proj ? proj.title : 'Project',
            first_name: m.first_name || u.first_name || '',
            last_name: m.last_name || u.last_name || '',
            user_email: m.user_email || u.email || `${m.username}@fairsplit.com`,
            experience: m.experience ?? u.experience ?? 2,
            availability_hours: m.availability_hours ?? u.availability_hours ?? 40,
            profile_picture: m.profile_picture || u.profile_picture || null,
            skills: (Array.isArray(m.skills) && m.skills.length > 0) ? m.skills : defaultRoleSkills
          };
        });
      }

      // Fetch Invitations across projects
      let aggregatedInvitations = [];
      try {
        if (selectedProjectId === 'all') {
          const invPromises = projectsData.map(p =>
            InvitationService.getProjectInvitations(p.id).catch(() => [])
          );
          const invResults = await Promise.all(invPromises);
          aggregatedInvitations = invResults.flat();
        } else {
          aggregatedInvitations = await InvitationService.getProjectInvitations(selectedProjectId).catch(() => []);
        }
      } catch (e) {
        console.error('Error fetching invitations:', e);
      }
      setInvitations(aggregatedInvitations);

      // Calculate task assignments count for each member
      const memberTaskCounts = {};
      (tasksData || []).forEach(task => {
        if (task.assigned_to) {
          memberTaskCounts[task.assigned_to] = (memberTaskCounts[task.assigned_to] || 0) + 1;
        }
      });

      const enhancedMembers = aggregatedMembers.map(m => ({
        ...m,
        assignedTasksCount: memberTaskCounts[m.user] || 0
      }));

      setMembers(enhancedMembers);
    } catch (err) {
      console.error('Error loading team members:', err);
      setError('Failed to load team members. Please check connection and try again.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedProjectId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchTeamData();
  }, [fetchTeamData]);

  // Click outside to close combobox dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (comboboxRef.current && !comboboxRef.current.contains(e.target)) {
        setIsComboboxOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Remove Member Handler
  const handleRemoveMember = async (member) => {
    setActiveMenuId(null);
    const dName = getDisplayName(member);
    if (!window.confirm(`Are you sure you want to remove ${dName} (@${member.username}) from ${toTitleCase(member.projectName)}?`)) return;
    try {
      await ProjectService.deleteProjectMember(member.id);
      showToast(`${dName} removed from ${toTitleCase(member.projectName)}.`);
      fetchTeamData();
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to remove member.', 'error');
    }
  };

  // Open Edit Role & Skills Modal
  const openEditRoleModal = (member) => {
    setActiveMenuId(null);
    setEditingMember(member);
    const roleKey = (member.role || 'developer').toLowerCase();
    setEditRole(member.role || 'developer');
    setEditSkills(Array.isArray(member.skills) && member.skills.length > 0 ? member.skills : (ROLE_SKILL_MAPPING[roleKey] || ROLE_SKILL_MAPPING.developer));
    setFormError(null);
    setIsEditRoleModalOpen(true);
  };

  // Submit Role & Skills Update
  const handleEditRoleSubmit = async (e) => {
    e.preventDefault();
    if (!editingMember) return;
    setIsSubmitting(true);
    setFormError(null);
    try {
      await ProjectService.updateProjectMember(editingMember.id, { 
        role: editRole,
        skills: editSkills
      });
      showToast(`Updated role and skills for ${getDisplayName(editingMember)}.`);
      setIsEditRoleModalOpen(false);
      fetchTeamData();
    } catch (err) {
      setFormError(err.response?.data?.error || err.response?.data?.detail || 'Failed to update role.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open View Profile Drawer/Modal
  const openViewProfileModal = (member) => {
    setActiveMenuId(null);
    setProfileMember(member);
    setIsProfileModalOpen(true);
  };

  // Handle Role Selection change in Add Modal with Confirmation Prompt for existing selections
  const handleAddRoleChange = (newRole) => {
    const defaultNewSkills = ROLE_SKILL_MAPPING[newRole.toLowerCase()] || ROLE_SKILL_MAPPING.developer;
    
    if (selectedSkills.length > 0) {
      // Prompt user whether to keep current selections or replace with new role suggestions
      setRoleChangePrompt({ newRole, defaultNewSkills });
    } else {
      setAddRole(newRole);
      setSelectedSkills(defaultNewSkills);
    }
  };

  // Confirm role change action
  const confirmRoleChange = (replaceWithDefaults) => {
    if (!roleChangePrompt) return;
    setAddRole(roleChangePrompt.newRole);
    if (replaceWithDefaults) {
      setSelectedSkills(roleChangePrompt.defaultNewSkills);
    }
    setRoleChangePrompt(null);
  };

  // Skill Handlers for Add Member Modal
  const toggleSkillSelection = (skillName) => {
    setSelectedSkills(prev => toggleSuggestedSkillNormalized(prev, skillName));
  };

  const handleAddCustomSkill = (e) => {
    if (e) e.preventDefault();
    const currentRoleSuggestedSkills = ROLE_SKILL_MAPPING[addRole.toLowerCase()] || ROLE_SKILL_MAPPING.developer;
    setSelectedSkills(prev => addSkillNormalized(prev, currentRoleSuggestedSkills, customSkillInput));
    setCustomSkillInput('');
  };

  const removeCustomSkill = (skillName) => {
    setSelectedSkills(prev => removeCustomSkillNormalized(prev, skillName));
  };

  // Skill Handlers for Invite Member Modal Tab
  const toggleInviteSkill = (skillName) => {
    setInviteSkills(prev => toggleSuggestedSkillNormalized(prev, skillName));
  };

  const handleInviteAddCustomSkill = (e) => {
    if (e) e.preventDefault();
    const currentInviteRoleSuggestedSkills = ROLE_SKILL_MAPPING[inviteRole.toLowerCase()] || ROLE_SKILL_MAPPING.developer;
    setInviteSkills(prev => addSkillNormalized(prev, currentInviteRoleSuggestedSkills, inviteCustomSkill));
    setInviteCustomSkill('');
  };

  const removeInviteCustomSkill = (skillName) => {
    setInviteSkills(prev => removeCustomSkillNormalized(prev, skillName));
  };

  // Skill Handlers for Edit Role Modal
  const toggleEditSkill = (skillName) => {
    setEditSkills(prev => toggleSuggestedSkillNormalized(prev, skillName));
  };

  const handleEditAddCustomSkill = (e) => {
    if (e) e.preventDefault();
    const currentEditRoleSuggestedSkills = ROLE_SKILL_MAPPING[editRole.toLowerCase()] || ROLE_SKILL_MAPPING.developer;
    setEditSkills(prev => addSkillNormalized(prev, currentEditRoleSuggestedSkills, editCustomSkillInput));
    setEditCustomSkillInput('');
  };

  const removeEditCustomSkill = (skillName) => {
    setEditSkills(prev => removeCustomSkillNormalized(prev, skillName));
  };

  // Duplicate member check logic for Add Modal
  const isDuplicateMember = useMemo(() => {
    if (!addProjectId || !addUserId) return false;
    return members.some(
      m => (m.project?.id ?? m.project ?? '').toString() === addProjectId.toString() &&
           (m.user?.id ?? m.user ?? '').toString() === addUserId.toString()
    );
  }, [members, addProjectId, addUserId]);

  // Combobox Instant Filtered Users
  const comboboxFilteredUsers = useMemo(() => {
    const existingMemberUserIds = new Set(
      members
        .filter(m => addProjectId && (m.project?.id ?? m.project ?? '').toString() === addProjectId.toString())
        .map(m => (m.user?.id ?? m.user ?? '').toString())
    );

    return allSystemUsers.filter(u => {
      const uname = (u.username || '').toLowerCase();
      const email = (u.email || '').toLowerCase();

      // 1. Exclude inactive users
      if (u.is_active === false) return false;
      // 2. Exclude verify accounts
      if (uname.includes('verify')) return false;
      // 3. Exclude test accounts
      if (uname.includes('test') || email.includes('test')) return false;
      // 4. Exclude example.com emails
      if (email.includes('example.com')) return false;
      // 5. Exclude already-added project members
      if (existingMemberUserIds.has(u.id.toString())) return false;

      // 6. Combobox instant search query matching
      if (comboboxSearch.trim()) {
        const q = comboboxSearch.toLowerCase();
        const dName = getDisplayName(u).toLowerCase();
        const selectedFormatted = `${getDisplayName(u)} (@${u.username})`.toLowerCase();
        if (q === selectedFormatted) return true;

        return dName.includes(q) || uname.includes(q) || email.includes(q);
      }

      return true;
    });
  }, [allSystemUsers, members, addProjectId, comboboxSearch]);

  // Keyboard navigation for Combobox
  const handleKeyDownCombobox = (e) => {
    if (!isComboboxOpen) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        setIsComboboxOpen(true);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev + 1) % Math.max(1, comboboxFilteredUsers.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev - 1 + comboboxFilteredUsers.length) % Math.max(1, comboboxFilteredUsers.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (comboboxFilteredUsers.length > 0 && highlightedIndex < comboboxFilteredUsers.length) {
        const selected = comboboxFilteredUsers[highlightedIndex];
        setAddUserId(selected.id.toString());
        setComboboxSearch(`${getDisplayName(selected)} (@${selected.username})`);
        setIsComboboxOpen(false);
      }
    } else if (e.key === 'Escape') {
      setIsComboboxOpen(false);
    }
  };

  // Add Member Submit
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!addProjectId || !addUserId || !addRole) {
      setFormError('Please select project, user, and role.');
      return;
    }
    if (isDuplicateMember) {
      setFormError('This user is already a member of the selected project.');
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    try {
      await ProjectService.addProjectMember(addProjectId, {
        user: parseInt(addUserId, 10),
        role: addRole,
        skills: selectedSkills
      });
      showToast('Team member added successfully with skills!');
      setIsAddModalOpen(false);
      setAddUserId('');
      setComboboxSearch('');
      fetchTeamData();
    } catch (err) {
      setFormError(err.response?.data?.error || err.response?.data?.detail || 'Failed to add member to project.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Send Invitation Handler
  const handleSendInviteSubmit = async (e) => {
    e.preventDefault();
    if (!addProjectId || !inviteEmail.trim()) {
      setFormError('Please select a project and enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    setFormError(null);
    setExistingPendingInv(null);

    try {
      const res = await InvitationService.sendInvitation(addProjectId, {
        email: inviteEmail.trim(),
        full_name: inviteFullName.trim(),
        role: inviteRole,
        skills: inviteSkills,
        personal_message: inviteMessage.trim(),
      });

      const emailSent = (res?.email_sent !== false) && (res?.data?.email_sent !== false);
      if (!emailSent) {
        showToast('Invitation created successfully, but the email could not be delivered.', 'warning');
      } else {
        showToast(`Invitation email sent to ${inviteEmail.trim()}!`);
      }

      setIsAddModalOpen(false);
      setInviteEmail('');
      setInviteFullName('');
      setInviteMessage('');
      fetchTeamData();
    } catch (err) {
      console.error('Send invitation error:', err);
      const parsed = parseInvitationError(err);

      if (parsed.type === 'duplicate_pending') {
        const found = invitations.find(
          inv => (inv.project?.id ?? inv.project ?? '').toString() === addProjectId.toString() &&
                 (inv.email || '').toLowerCase() === inviteEmail.trim().toLowerCase() &&
                 (inv.status === 'PENDING' || inv.status === 'OPENED')
        );
        setExistingPendingInv(found || { email: inviteEmail.trim(), id: null });
        setFormError('A pending invitation has already been sent to this email.');
        showToast('A pending invitation has already been sent to this email.', 'warning');
      } else {
        setFormError(parsed.message);
        showToast(parsed.message, 'error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Resend Invitation Handler
  const handleResendInvitation = async (invitation) => {
    console.log('[RESEND TRACE: INSIDE HANDLER START] invitation:', invitation);
    if (!invitation || !invitation.id) {
      console.warn('[RESEND TRACE: INVALID INVITATION OBJECT]', invitation);
      return;
    }

    // Rule 6: Never send repeated requests while cooldown is active
    const activeCooldownSecs = getRemainingCooldown(invitation);
    console.log('[RESEND TRACE: COOLDOWN CHECK] activeCooldownSecs:', activeCooldownSecs);
    if (activeCooldownSecs > 0) {
      showToast(`Please wait ${formatCooldownTime(activeCooldownSecs)} before resending this invitation again.`, 'warning');
      return;
    }

    setActionLoadingId(invitation.id);
    console.log('[RESEND TRACE: BEFORE AXIOS CALL] invitation_id:', invitation.id);
    try {
      const res = await InvitationService.resendInvitation(invitation.id);
      console.log('[RESEND TRACE: AFTER AXIOS SUCCESS] raw res object:', res);
      const emailSent = (res?.email_sent !== false) && (res?.data?.email_sent !== false);
      console.log('[RESEND TRACE: EMAIL_SENT EVALUATION]', {
        'res?.email_sent': res?.email_sent,
        'res?.data?.email_sent': res?.data?.email_sent,
        calculatedEmailSent: emailSent
      });

      if (!emailSent) {
        showToast('Invitation updated, but email could not be resent.', 'warning');
      } else {
        showToast(`Fresh invitation email sent to ${invitation.email}!`);
      }

      // Initialize 5-minute (300s) cooldown timer upon successful resend
      setCooldownTimers(prev => ({ ...prev, [invitation.id]: 300 }));

      setHighlightedInvitationId(invitation.id);
      setActiveDirectoryTab('invitations');
      fetchTeamData();
    } catch (err) {
      console.error('[RESEND TRACE: AFTER AXIOS ERROR IN TEAMS]', err);
      const parsed = parseInvitationError(err, invitation.id);
      showToast(parsed.message, 'error');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Cancel Invitation Handler
  const handleCancelInvitation = async (invitation) => {
    if (!invitation || !invitation.id) return;
    if (!window.confirm(`Are you sure you want to cancel the invitation sent to ${invitation.email}?`)) return;
    setActionLoadingId(invitation.id);
    try {
      await InvitationService.cancelInvitation(invitation.id);
      showToast(`Invitation for ${invitation.email} was cancelled.`);
      setHighlightedInvitationId(invitation.id);
      setActiveDirectoryTab('invitations');
      fetchTeamData();
    } catch (err) {
      const parsed = parseInvitationError(err);
      showToast(parsed.message, 'error');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Processed Filtered & Sorted Invitations
  const processedInvitations = useMemo(() => {
    return invitations.filter(inv => {
      const email = (inv.email || '').toLowerCase();
      const name = (inv.full_name || '').toLowerCase();
      const role = (inv.role || '').toLowerCase();
      const project = (inv.project_title || '').toLowerCase();
      const query = searchQuery.toLowerCase();

      const matchesSearch = email.includes(query) || name.includes(query) || role.includes(query) || project.includes(query);
      const matchesStatus = invitationStatusFilter === 'all' || inv.status.toLowerCase() === invitationStatusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [invitations, searchQuery, invitationStatusFilter]);

  // Invitation Metrics
  const invitationMetrics = useMemo(() => {
    return {
      pending: invitations.filter(i => i.status === 'PENDING' || i.status === 'OPENED').length,
      accepted: invitations.filter(i => i.status === 'ACCEPTED').length,
      expired: invitations.filter(i => i.status === 'EXPIRED').length,
      declined: invitations.filter(i => i.status === 'DECLINED').length,
    };
  }, [invitations]);
  const processedMembers = useMemo(() => {
    return members
      .filter(m => {
        const dName = getDisplayName(m).toLowerCase();
        const uname = (m.username || '').toLowerCase();
        const email = (m.user_email || '').toLowerCase();
        const role = (m.role || '').toLowerCase();
        const project = (m.projectName || '').toLowerCase();
        const skillsStr = (Array.isArray(m.skills) ? m.skills.join(' ') : '').toLowerCase();
        const query = searchQuery.toLowerCase();

        const matchesSearch = dName.includes(query) || uname.includes(query) || email.includes(query) || role.includes(query) || project.includes(query) || skillsStr.includes(query);
        const matchesRole = roleFilter === 'all' || role === roleFilter.toLowerCase();
        return matchesSearch && matchesRole;
      })
      .sort((a, b) => {
        if (sortBy === 'name') {
          return getDisplayName(a).localeCompare(getDisplayName(b));
        } else if (sortBy === 'experience') {
          return (b.experience || 0) - (a.experience || 0);
        } else if (sortBy === 'availability') {
          return (b.availability_hours || 0) - (a.availability_hours || 0);
        } else if (sortBy === 'tasks') {
          return (b.assignedTasksCount || 0) - (a.assignedTasksCount || 0);
        } else if (sortBy === 'joined') {
          return new Date(b.joined_at) - new Date(a.joined_at);
        }
        return 0;
      });
  }, [members, searchQuery, roleFilter, sortBy]);

  const uniqueRoles = useMemo(() => {
    const set = new Set(members.map(m => m.role).filter(Boolean));
    return Array.from(set);
  }, [members]);

  // Derived KPI Metrics
  const totalCapacityHours = useMemo(() => {
    return members.reduce((acc, m) => acc + (m.availability_hours || 40), 0);
  }, [members]);

  const avgExperienceYears = useMemo(() => {
    if (members.length === 0) return 0;
    const total = members.reduce((acc, m) => acc + (m.experience || 0), 0);
    return (total / members.length).toFixed(1);
  }, [members]);

  const isAddSubmitDisabled = isSubmitting || !addProjectId || !addUserId || !addRole || isDuplicateMember;

  const currentRoleSuggestedSkills = useMemo(() => {
    return ROLE_SKILL_MAPPING[addRole.toLowerCase()] || ROLE_SKILL_MAPPING.developer;
  }, [addRole]);

  return (
    <div className="space-y-8 pb-12">
      {/* Toast Notification */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}

      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 dark:border-white/5 pb-5">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Team Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage project members, roles, skills, and pending email invitations.</p>
          
          {/* Main Directory Tabs */}
          <div className="flex items-center gap-2 mt-4 bg-gray-100 dark:bg-white/5 p-1 rounded-xl w-fit">
            <button
              onClick={() => setActiveDirectoryTab('members')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeDirectoryTab === 'members'
                  ? 'bg-white dark:bg-[#1C1C1E] text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Active Members ({members.length})</span>
            </button>
            <button
              onClick={() => setActiveDirectoryTab('invitations')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeDirectoryTab === 'invitations'
                  ? 'bg-white dark:bg-[#1C1C1E] text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>Invitations ({invitations.length})</span>
              {invitationMetrics.pending > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-amber-500 text-white">
                  {invitationMetrics.pending}
                </span>
              )}
            </button>
          </div>
        </div>
        <button
          onClick={() => {
            if (projects.length > 0) setAddProjectId(projects[0].id.toString());
            setAddUserId('');
            setComboboxSearch('');
            setSelectedSkills(ROLE_SKILL_MAPPING.developer);
            setIsAddModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[13px] font-semibold transition-all shadow-sm shadow-blue-600/10 hover:shadow-md shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          Add / Invite Member
        </button>
      </div>

      {activeDirectoryTab === 'invitations' ? (
        <div className="space-y-6">
          {/* Invitation KPI Dashboard Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-5 rounded-2xl bg-white dark:bg-[#161616] border border-gray-200/70 dark:border-white/5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Pending</span>
                <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400">
                  <Clock className="w-5 h-5" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-3">{invitationMetrics.pending}</p>
              <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">Awaiting invitee response</span>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#161616] border border-gray-200/70 dark:border-white/5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Accepted</span>
                <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-3">{invitationMetrics.accepted}</p>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Joined project teams</span>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#161616] border border-gray-200/70 dark:border-white/5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Expired</span>
                <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400">
                  <ShieldAlert className="w-5 h-5" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-3">{invitationMetrics.expired}</p>
              <span className="text-[11px] text-rose-600 dark:text-rose-400 font-medium">Exceeded 7 days limit</span>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#161616] border border-gray-200/70 dark:border-white/5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Declined</span>
                <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-white/5 text-gray-500">
                  <MailX className="w-5 h-5" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-3">{invitationMetrics.declined}</p>
              <span className="text-[11px] text-gray-400 font-medium">Declined by recipient</span>
            </div>
          </div>

          {/* Invitation Status Filter Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50/50 dark:bg-white/[0.02] p-4 rounded-2xl border border-gray-200/50 dark:border-white/5">
            <div className="flex flex-wrap items-center gap-1.5">
              {['all', 'pending', 'opened', 'accepted', 'declined', 'cancelled', 'expired'].map(st => (
                <button
                  key={st}
                  onClick={() => setInvitationStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                    invitationStatusFilter === st
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/20'
                      : 'bg-white dark:bg-[#111] text-gray-600 dark:text-gray-300 border border-gray-200/60 dark:border-white/10 hover:bg-gray-100'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search invitations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-white dark:bg-[#111111] border border-gray-200 dark:border-white/10 rounded-xl text-xs outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Invitation Cards / Table */}
          {isLoading ? (
            <div className="py-12 text-center">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
            </div>
          ) : processedInvitations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-gray-300 dark:border-white/10 rounded-2xl">
              <Send className="w-12 h-12 text-gray-400 mb-3" />
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">No invitations found</h3>
              <p className="text-xs text-gray-500 mt-1">No invitations match the selected status or search filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {processedInvitations.map(inv => {
                const isPendingOrOpened = inv.status === 'PENDING' || inv.status === 'OPENED';
                const isActionLoading = actionLoadingId === inv.id;

                let statusBadge = (
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/30 text-amber-600 border border-amber-200/50">
                    Pending
                  </span>
                );

                if (inv.status === 'OPENED') {
                  statusBadge = (
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/30 text-blue-600 border border-blue-200/50">
                      Opened
                    </span>
                  );
                } else if (inv.status === 'ACCEPTED') {
                  statusBadge = (
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 border border-emerald-200/50">
                      Accepted
                    </span>
                  );
                } else if (inv.status === 'EXPIRED') {
                  statusBadge = (
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 dark:bg-rose-950/30 text-rose-600 border border-rose-200/50">
                      Expired
                    </span>
                  );
                } else if (inv.status === 'CANCELLED') {
                  statusBadge = (
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 dark:bg-white/5 text-gray-500 border border-gray-200">
                      Cancelled
                    </span>
                  );
                }

                const isHighlighted = highlightedInvitationId === inv.id;

                return (
                  <div
                    key={inv.id}
                    className={`p-5 rounded-2xl bg-white dark:bg-[#161616] border shadow-sm space-y-4 flex flex-col justify-between transition-all duration-300 ${
                      isHighlighted
                        ? 'border-blue-500 ring-2 ring-blue-500/50 bg-blue-50/20 dark:bg-blue-950/20 shadow-md scale-[1.01]'
                        : 'border-gray-200/70 dark:border-white/5'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-base font-bold text-gray-900 dark:text-white leading-snug">
                              {inv.full_name || inv.email.split('@')[0]}
                            </h4>
                            {isHighlighted && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-blue-600 text-white uppercase tracking-wider animate-pulse">
                                Selected
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 font-mono">{inv.email}</p>
                        </div>
                        {statusBadge}
                      </div>

                      <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-400 font-medium">Project:</span>
                          <span className="font-bold text-gray-800 dark:text-gray-200">{toTitleCase(inv.project_title)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400 font-medium">Role:</span>
                          <span className="font-bold text-blue-600 dark:text-blue-400 capitalize">{inv.role || 'Member'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400 font-medium">Sent:</span>
                          <span className="font-medium text-gray-600 dark:text-gray-300">
                            {new Date(inv.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400 font-medium">Expires:</span>
                          <span className="font-medium text-amber-600 dark:text-amber-400">
                            {new Date(inv.expires_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>
                      </div>

                      {inv.skills && inv.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {inv.skills.map((sk, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-blue-50 dark:bg-blue-950/30 text-blue-600 border border-blue-200/40">
                              {sk}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Actions: Resend & Cancel */}
                    {isPendingOrOpened && (() => {
                      const remainingCooldownSecs = getRemainingCooldown(inv);
                      const isCooldownActive = remainingCooldownSecs > 0;

                      return (
                        <div className="pt-3 border-t border-gray-100 dark:border-white/5 flex gap-2">
                          <button
                            disabled={isActionLoading || isCooldownActive}
                            onClick={() => {
                              console.log('[RESEND TRACE: ONCLICK FIRED] invitation:', inv);
                              handleResendInvitation(inv);
                            }}
                            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                              isCooldownActive
                                ? 'bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-gray-500 cursor-not-allowed border border-gray-200/50 dark:border-white/5'
                                : 'bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/30 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 disabled:opacity-50'
                            }`}
                            title={isCooldownActive ? `Resend available in ${formatCooldownTime(remainingCooldownSecs)}` : 'Resend Email'}
                          >
                            {isActionLoading ? (
                              <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                <span>Resending...</span>
                              </>
                            ) : isCooldownActive ? (
                              <>
                                <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                                <span>Resend in {formatCooldownTime(remainingCooldownSecs)}</span>
                              </>
                            ) : (
                              <>
                                <RotateCw className="w-3.5 h-3.5" />
                                <span>Resend Email</span>
                              </>
                            )}
                          </button>
                          <button
                            disabled={isActionLoading}
                            onClick={() => handleCancelInvitation(inv)}
                            className="py-2 px-3 bg-red-50 hover:bg-red-100 dark:bg-red-950/30 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1 disabled:opacity-50"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Cancel</span>
                          </button>
                        </div>
                      );
                    })()}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Production KPI Metrics Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-5 rounded-2xl bg-white dark:bg-[#161616] border border-gray-200/70 dark:border-white/5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Members</span>
                <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400">
                  <Users className="w-5 h-5" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-3">{members.length}</p>
              <span className="text-[11px] text-gray-400 font-medium">Assigned across projects</span>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#161616] border border-gray-200/70 dark:border-white/5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Active Projects</span>
                <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400">
                  <FolderKanban className="w-5 h-5" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-3">{projects.length}</p>
              <span className="text-[11px] text-purple-600 dark:text-purple-400 font-medium">Teams active</span>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#161616] border border-gray-200/70 dark:border-white/5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Weekly Capacity</span>
                <div className="p-2.5 rounded-xl bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400">
                  <Clock className="w-5 h-5" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-3">{totalCapacityHours} hrs</p>
              <span className="text-[11px] text-green-600 dark:text-green-400 font-medium">Total available bandwidth</span>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#161616] border border-gray-200/70 dark:border-white/5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Avg Experience</span>
                <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400">
                  <Award className="w-5 h-5" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-3">{avgExperienceYears} yrs</p>
              <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">Average team seniority</span>
            </div>
          </div>

          {/* Enhanced Filters, Search, & Sort Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-gray-50/50 dark:bg-white/[0.02] p-4 rounded-2xl border border-gray-200/50 dark:border-white/5">
            {/* Search Input */}
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, username, email, role, or skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-[#111111] border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
              />
            </div>

            {/* Project Filter */}
            <div className="w-full">
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-[#111111] border border-gray-200 dark:border-white/10 rounded-xl text-sm outline-none focus:border-blue-500 transition-all font-semibold"
              >
                <option value="all">All Project Teams</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id.toString()}>{toTitleCase(p.title)}</option>
                ))}
              </select>
            </div>

            {/* Role Filter */}
            <div className="w-full">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-[#111111] border border-gray-200 dark:border-white/10 rounded-xl text-sm outline-none focus:border-blue-500 transition-all font-semibold capitalize"
              >
                <option value="all">All Roles</option>
                {uniqueRoles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="w-full">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-[#111111] border border-gray-200 dark:border-white/10 rounded-xl text-sm outline-none focus:border-blue-500 transition-all font-semibold"
              >
                <option value="name">Sort by Name (A-Z)</option>
                <option value="experience">Sort by Experience (High to Low)</option>
                <option value="availability">Sort by Availability (High to Low)</option>
                <option value="tasks">Sort by Assigned Tasks</option>
                <option value="joined">Sort by Joined Date</option>
              </select>
            </div>
          </div>

          {/* Main Content Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                <div key={n} className="h-64 rounded-2xl border border-gray-200 dark:border-white/5 p-5 animate-pulse bg-gray-50/50 dark:bg-white/[0.02] flex flex-col justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-white/10"></div>
                    <div className="space-y-2 flex-1">
                      <div className="h-4 w-3/4 bg-gray-200 dark:bg-white/10 rounded"></div>
                      <div className="h-3 w-1/2 bg-gray-200 dark:bg-white/10 rounded"></div>
                    </div>
                  </div>
                  <div className="space-y-2 pt-4">
                    <div className="h-3 w-full bg-gray-200 dark:bg-white/10 rounded"></div>
                    <div className="h-3 w-2/3 bg-gray-200 dark:bg-white/10 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-16 text-center bg-gray-50 dark:bg-[#111] rounded-2xl border border-gray-200/50 dark:border-white/5">
              <AlertCircle className="w-10 h-10 text-red-500 mb-3" />
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">{error}</h3>
              <button 
                onClick={fetchTeamData}
                className="mt-4 px-4 py-2 bg-gray-200 dark:bg-white/10 rounded-xl text-sm font-semibold hover:bg-gray-300 dark:hover:bg-white/20 transition-all flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" /> Retry
              </button>
            </div>
          ) : processedMembers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-gray-300 dark:border-white/10 rounded-2xl">
              <Users className="w-12 h-12 text-gray-400 mb-4" />
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">No team members found</h3>
              <p className="text-sm text-gray-500 mt-1 max-w-xs mx-auto">
                {searchQuery || roleFilter !== 'all' || selectedProjectId !== 'all'
                  ? 'No team members matched your current filter criteria.'
                  : 'Add members to your project teams to start managing workloads.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {processedMembers.map(member => {
                const displayName = getDisplayName(member);
                const isMenuOpen = activeMenuId === member.id;
                const memberSkills = Array.isArray(member.skills) ? member.skills : [];

                return (
                  <div 
                    key={member.id}
                    className="group relative p-5 rounded-2xl bg-white dark:bg-[#161616] border border-gray-200/70 dark:border-white/5 hover:border-blue-500/40 dark:hover:border-blue-500/40 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between transform hover:-translate-y-1"
                  >
                    <div>
                      {/* Header: Avatar, Name, Role, & Three-dot menu */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Avatar with status indicator */}
                          <div className="relative shrink-0">
                            {member.profile_picture ? (
                              <img 
                                src={member.profile_picture} 
                                alt={displayName} 
                                className="w-12 h-12 rounded-full object-cover border border-gray-200 dark:border-white/10"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-blue-500/20">
                                {displayName.substring(0, 2).toUpperCase()}
                              </div>
                            )}
                            <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white dark:border-[#161616]" title="Active Member"></div>
                          </div>

                          {/* Display Name & Separate Username */}
                          <div className="min-w-0">
                            <h3 className="text-base font-bold text-gray-900 dark:text-white leading-snug truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {displayName}
                            </h3>
                            <span className="text-xs text-gray-400 font-mono block truncate">
                              @{member.username}
                            </span>
                            <span className="inline-block px-2 py-0.5 mt-1 rounded-md text-[10px] font-bold bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border border-blue-200/40 dark:border-blue-900/30 capitalize">
                              {member.role || 'Member'}
                            </span>
                          </div>
                        </div>

                        {/* Three-Dot Action Menu Button */}
                        <div className="relative shrink-0">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveMenuId(isMenuOpen ? null : member.id);
                            }}
                            className="p-1.5 text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors"
                            title="Actions menu"
                            aria-label="Member Actions"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {/* Floating Dropdown Menu */}
                          {isMenuOpen && (
                            <div 
                              className="absolute right-0 top-8 w-44 bg-white dark:bg-[#1C1C1C] border border-gray-200 dark:border-white/10 rounded-xl shadow-xl z-30 py-1 text-xs font-semibold animate-fadeIn"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                onClick={() => openViewProfileModal(member)}
                                className="w-full px-3 py-2 flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-left"
                              >
                                <Eye className="w-3.5 h-3.5" /> View Profile
                              </button>

                              <button
                                onClick={() => openEditRoleModal(member)}
                                className="w-full px-3 py-2 flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-950/30 hover:text-purple-600 dark:hover:text-purple-400 transition-colors text-left"
                              >
                                <Edit2 className="w-3.5 h-3.5" /> Edit Role & Skills
                              </button>

                              <div className="border-t border-gray-100 dark:border-white/5 my-1"></div>

                              <button
                                onClick={() => handleRemoveMember(member)}
                                className="w-full px-3 py-2 flex items-center gap-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors text-left"
                              >
                                <Trash2 className="w-3.5 h-3.5" /> Remove Member
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Skills Chips Display Row */}
                      <div className="my-2.5 flex flex-wrap gap-1">
                        {memberSkills.slice(0, 4).map((sk, idx) => (
                          <span 
                            key={idx} 
                            className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 border border-gray-200/50 dark:border-white/5"
                          >
                            {sk}
                          </span>
                        ))}
                        {memberSkills.length > 4 && (
                          <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400">
                            +{memberSkills.length - 4} more
                          </span>
                        )}
                      </div>

                      {/* Details Grid */}
                      <div className="space-y-2 text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-white/5">
                        <div className="flex items-center gap-2">
                          <FolderKanban className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                          <span className="truncate font-semibold text-gray-800 dark:text-gray-200">
                            {toTitleCase(member.projectName)}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Mail className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                          <a href={`mailto:${member.user_email}`} className="truncate hover:underline hover:text-blue-500 transition-colors">
                            {member.user_email}
                          </a>
                        </div>

                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-white/[0.02] p-1.5 rounded-lg border border-gray-100 dark:border-white/5">
                            <Clock className="w-3 h-3 text-green-500 shrink-0" />
                            <span className="text-[11px] font-bold text-gray-700 dark:text-gray-300">{member.availability_hours || 40}h / wk</span>
                          </div>

                          <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-white/[0.02] p-1.5 rounded-lg border border-gray-100 dark:border-white/5">
                            <Award className="w-3 h-3 text-amber-500 shrink-0" />
                            <span className="text-[11px] font-bold text-gray-700 dark:text-gray-300">{member.experience || 1} yrs exp</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Footer Stats: Assigned Tasks & Joined Date */}
                    <div className="mt-4 pt-3 border-t border-gray-100 dark:border-white/5 flex items-center justify-between text-[11px] text-gray-400">
                      <div className="flex items-center gap-1">
                        <CheckSquare className="w-3.5 h-3.5 text-blue-500" />
                        <span className="font-semibold text-gray-700 dark:text-gray-300">{member.assignedTasksCount} Task(s)</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{member.joined_at ? new Date(member.joined_at).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : 'Active'}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* ADD MEMBER / INVITE MODAL WITH TAB TOGGLE */}
      <Modal 
        isOpen={isAddModalOpen} 
        onClose={() => { 
          setIsAddModalOpen(false); 
          setFormError(null); 
          setComboboxSearch('');
          setIsComboboxOpen(false);
          setRoleChangePrompt(null);
        }} 
        title="Add or Invite Team Member"
      >
        <div className="space-y-4 max-h-[80vh] overflow-y-auto pr-1">
          {/* Modal Option Selector Tabs */}
          <div className="flex bg-gray-100 dark:bg-white/5 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => { setAddMemberTab('existing'); setFormError(null); setExistingPendingInv(null); }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
                addMemberTab === 'existing'
                  ? 'bg-white dark:bg-[#1C1C1E] text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>1. Add Existing User</span>
            </button>
            <button
              type="button"
              onClick={() => { setAddMemberTab('invite'); setFormError(null); setExistingPendingInv(null); }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
                addMemberTab === 'invite'
                  ? 'bg-white dark:bg-[#1C1C1E] text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>2. Invite New Member</span>
            </button>
          </div>

          {formError && (
            <div className="p-3.5 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-xs rounded-xl border border-red-200 dark:border-red-900/50 leading-snug space-y-2.5">
              <div className="flex items-center gap-2 font-semibold">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                <span>{formError}</span>
              </div>

              {existingPendingInv && (() => {
                const remainingCalloutSecs = getRemainingCooldown(existingPendingInv);
                const isCalloutCooldownActive = remainingCalloutSecs > 0;

                return (
                  <div className="pt-2 border-t border-red-200/50 dark:border-red-900/40 flex flex-wrap gap-2">
                    <button
                      type="button"
                      disabled={actionLoadingId === existingPendingInv.id || isCalloutCooldownActive}
                      onClick={async () => {
                        if (existingPendingInv.id) {
                          await handleResendInvitation(existingPendingInv);
                          if (!isCalloutCooldownActive) {
                            setIsAddModalOpen(false);
                            setExistingPendingInv(null);
                            setFormError(null);
                          }
                        } else {
                          showToast('Existing invitation token refreshed.', 'info');
                        }
                      }}
                      className={`px-3 py-1.5 font-bold rounded-lg text-xs transition-all flex items-center gap-1.5 shadow-sm ${
                        isCalloutCooldownActive
                          ? 'bg-gray-200 dark:bg-white/10 text-gray-400 dark:text-gray-500 cursor-not-allowed border border-gray-300/40 dark:border-white/5'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      {actionLoadingId === existingPendingInv?.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : isCalloutCooldownActive ? (
                        <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      ) : (
                        <RotateCw className="w-3.5 h-3.5" />
                      )}
                      <span>
                        {isCalloutCooldownActive
                          ? `Resend in ${formatCooldownTime(remainingCalloutSecs)}`
                          : 'Resend Invitation'}
                      </span>
                    </button>

                    <button
                      type="button"
                      disabled={actionLoadingId === existingPendingInv.id}
                      onClick={async () => {
                        if (existingPendingInv.id) {
                          await handleCancelInvitation(existingPendingInv);
                          setExistingPendingInv(null);
                          setFormError(null);
                        } else {
                          showToast('Please manage invitations from the Invitations tab.', 'info');
                        }
                      }}
                      className="px-3 py-1.5 bg-red-100 hover:bg-red-200 dark:bg-red-900/40 dark:hover:bg-red-900/60 text-red-700 dark:text-red-300 font-bold rounded-lg text-xs transition-all flex items-center gap-1.5"
                    >
                      {actionLoadingId === existingPendingInv?.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <XCircle className="w-3.5 h-3.5" />}
                      <span>Cancel Existing Invitation</span>
                    </button>
                  </div>
                );
              })()}
            </div>
          )}

          {addMemberTab === 'existing' ? (
            /* TAB 1: ADD EXISTING USER FORM */
            <form onSubmit={handleAddSubmit} className="space-y-4">
              {isDuplicateMember && (
                <div className="p-3 bg-yellow-50 dark:bg-yellow-950/20 text-yellow-800 dark:text-yellow-400 text-xs rounded-xl border border-yellow-200 dark:border-yellow-900/50 leading-snug flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-yellow-600 shrink-0" />
                  <span>This user is already a member of the selected project team.</span>
                </div>
              )}

              {/* Role Change Confirmation Dialog */}
              {roleChangePrompt && (
                <div className="p-3.5 bg-blue-50 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-900/50 text-xs space-y-2">
                  <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 font-bold">
                    <Sparkles className="w-4 h-4 shrink-0" />
                    <span>Role Changed to {roleChangePrompt.newRole}</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 leading-snug">
                    Would you like to replace your currently selected skills with recommended skills for {roleChangePrompt.newRole}, or keep your current selections?
                  </p>
                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => confirmRoleChange(true)}
                      className="px-3 py-1 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Replace with New Defaults
                    </button>
                    <button
                      type="button"
                      onClick={() => confirmRoleChange(false)}
                      className="px-3 py-1 border border-blue-300 dark:border-blue-800 text-blue-700 dark:text-blue-300 font-semibold rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                    >
                      Keep Existing Skills
                    </button>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase" htmlFor="add-project-select">
                  Select Project *
                </label>
                <select
                  id="add-project-select"
                  required
                  value={addProjectId}
                  onChange={(e) => {
                    setAddProjectId(e.target.value);
                    setAddUserId('');
                    setComboboxSearch('');
                  }}
                  className="w-full px-3 py-2 bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:border-blue-500 outline-none transition-colors"
                >
                  <option value="">Choose a project...</option>
                  {projects.map(p => (
                    <option key={p.id} value={p.id.toString()}>{toTitleCase(p.title)}</option>
                  ))}
                </select>
              </div>

              {/* Searchable Combobox for User Selection */}
              <div className="relative" ref={comboboxRef}>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase" htmlFor="combobox-user-input">
                  Select User *
                </label>
                
                <div className="relative">
                  <input
                    id="combobox-user-input"
                    type="text"
                    required
                    placeholder="Search candidate by name, @username, or email..."
                    value={comboboxSearch}
                    onFocus={() => setIsComboboxOpen(true)}
                    onChange={(e) => {
                      setComboboxSearch(e.target.value);
                      setAddUserId('');
                      setIsComboboxOpen(true);
                      setHighlightedIndex(0);
                    }}
                    onKeyDown={handleKeyDownCombobox}
                    className="w-full pl-3 pr-9 py-2 bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                  />
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>

                {/* Combobox Dropdown Options Menu */}
                {isComboboxOpen && (
                  <div className="absolute left-0 right-0 top-full mt-1.5 max-h-56 overflow-y-auto bg-white dark:bg-[#1C1C1C] border border-gray-200 dark:border-white/10 rounded-xl shadow-2xl z-50 py-1 divide-y divide-gray-100 dark:divide-white/5 animate-fadeIn">
                    {comboboxFilteredUsers.length === 0 ? (
                      <div className="p-3 text-xs text-gray-400 text-center">
                        No matching users found
                      </div>
                    ) : (
                      comboboxFilteredUsers.map((u, index) => {
                        const isSelected = addUserId === u.id.toString();
                        const isHighlighted = index === highlightedIndex;

                        return (
                          <div
                            key={u.id}
                            onClick={() => {
                              setAddUserId(u.id.toString());
                              setComboboxSearch(`${getDisplayName(u)} (@${u.username})`);
                              setIsComboboxOpen(false);
                            }}
                            onMouseEnter={() => setHighlightedIndex(index)}
                            className={`p-2.5 cursor-pointer flex items-center justify-between transition-colors ${
                              isHighlighted 
                                ? 'bg-blue-50 dark:bg-blue-950/30' 
                                : 'hover:bg-gray-50 dark:hover:bg-white/[0.02]'
                            }`}
                          >
                            <div className="min-w-0 pr-2">
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-bold text-gray-900 dark:text-white truncate">
                                  {getDisplayName(u)}
                                </span>
                                <span className="text-[11px] font-mono text-gray-400 truncate">
                                  @{u.username}
                                </span>
                              </div>
                              <span className="text-[11px] text-gray-400 block truncate mt-0.5">
                                {u.email || `${u.username}@fairsplit.com`}
                              </span>
                            </div>

                            {isSelected && (
                              <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>

              {/* Team Role Dropdown */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase" htmlFor="add-role-select">
                  Team Role *
                </label>
                <select
                  id="add-role-select"
                  value={addRole}
                  onChange={(e) => handleAddRoleChange(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:border-blue-500 outline-none transition-colors capitalize"
                >
                  <option value="fullstack">Full Stack Developer</option>
                  <option value="frontend">Frontend Developer</option>
                  <option value="backend">Backend Developer</option>
                  <option value="ml">Machine Learning Engineer</option>
                  <option value="tester">Tester</option>
                  <option value="designer">Designer</option>
                </select>
              </div>

              {/* Suggested Skills & Selectable Chips Section */}
              <div className="p-3.5 bg-gray-50 dark:bg-white/[0.02] rounded-2xl border border-gray-200/60 dark:border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-gray-800 dark:text-gray-200">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>Suggested Skills ({addRole})</span>
                  </div>
                  <span className="text-[11px] text-gray-400 font-medium">
                    {selectedSkills.length} selected
                  </span>
                </div>

                {/* Selectable Skill Chips */}
                <div className="flex flex-wrap gap-1.5">
                  {currentRoleSuggestedSkills.map((skillName) => {
                    const isChecked = selectedSkills.some(s => s.toLowerCase() === skillName.toLowerCase());
                    return (
                      <button
                        key={skillName}
                        type="button"
                        onClick={() => toggleSkillSelection(skillName)}
                        className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                          isChecked 
                            ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/20' 
                            : 'bg-white dark:bg-[#111] text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-white/10 hover:border-blue-400'
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3" />}
                        <span>{skillName}</span>
                      </button>
                    );
                  })}

                  {/* Display Custom Skills added by user that are not in defaults */}
                  {selectedSkills.filter(s => !currentRoleSuggestedSkills.some(sugg => sugg.toLowerCase() === s.toLowerCase())).map((skillName) => (
                    <div
                      key={skillName}
                      className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-purple-600 text-white shadow-sm shadow-purple-600/20 flex items-center gap-1.5"
                    >
                      <span className="bg-purple-800/60 px-1 py-0.2 text-[9px] rounded uppercase tracking-wider font-mono">Custom</span>
                      <span>{skillName}</span>
                      <button
                        type="button"
                        onClick={() => removeCustomSkill(skillName)}
                        className="p-0.5 hover:bg-purple-700 rounded-full transition-colors ml-0.5"
                        title="Remove custom skill"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Custom Skill Input */}
                <div className="pt-2 border-t border-gray-200/40 dark:border-white/5 flex gap-2">
                  <input
                    type="text"
                    placeholder="Add custom skill (e.g. Kubernetes, GraphQL)..."
                    value={customSkillInput}
                    onChange={(e) => setCustomSkillInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleAddCustomSkill(e); }}
                    className="flex-1 px-3 py-1.5 bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-xl text-xs outline-none focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomSkill}
                    className="px-3 py-1.5 bg-gray-200 dark:bg-white/10 hover:bg-gray-300 dark:hover:bg-white/20 text-gray-800 dark:text-gray-200 font-semibold rounded-xl text-xs transition-colors flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add
                  </button>
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl text-sm font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAddSubmitDisabled}
                  className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-sm font-semibold transition-all shadow-sm shadow-blue-600/10"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Adding Member...</span>
                    </>
                  ) : (
                    <span>Add Member</span>
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* TAB 2: INVITE NEW MEMBER FORM */
            <form onSubmit={handleSendInviteSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase" htmlFor="invite-project-select">
                  Select Project *
                </label>
                <select
                  id="invite-project-select"
                  required
                  value={addProjectId}
                  onChange={(e) => setAddProjectId(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:border-blue-500 outline-none transition-colors"
                >
                  <option value="">Choose a project...</option>
                  {projects.map(p => (
                    <option key={p.id} value={p.id.toString()}>{toTitleCase(p.title)}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase" htmlFor="invite-fullname-input">
                    Full Name (Optional)
                  </label>
                  <input
                    id="invite-fullname-input"
                    type="text"
                    placeholder="e.g. Alex Johnson"
                    value={inviteFullName}
                    onChange={(e) => setInviteFullName(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-white/10 rounded-xl text-sm outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase" htmlFor="invite-email-input">
                    Email Address *
                  </label>
                  <input
                    id="invite-email-input"
                    type="email"
                    required
                    placeholder="alex@company.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-white/10 rounded-xl text-sm outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase" htmlFor="invite-role-select">
                  Assigned Team Role *
                </label>
                <select
                  id="invite-role-select"
                  value={inviteRole}
                  onChange={(e) => {
                    const newRole = e.target.value;
                    setInviteRole(newRole);
                    setInviteSkills(ROLE_SKILL_MAPPING[newRole.toLowerCase()] || ROLE_SKILL_MAPPING.developer);
                  }}
                  className="w-full px-3 py-2 bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:border-blue-500 outline-none transition-colors capitalize"
                >
                  <option value="fullstack">Full Stack Developer</option>
                  <option value="frontend">Frontend Developer</option>
                  <option value="backend">Backend Developer</option>
                  <option value="ml">Machine Learning Engineer</option>
                  <option value="tester">Tester</option>
                  <option value="designer">Designer</option>
                </select>
              </div>

              {/* Suggested Skills Chips */}
              <div className="p-3.5 bg-gray-50 dark:bg-white/[0.02] rounded-2xl border border-gray-200/60 dark:border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-gray-800 dark:text-gray-200">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>Target Skills ({inviteRole})</span>
                  </div>
                  <span className="text-[11px] text-gray-400 font-medium">{inviteSkills.length} active</span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {(ROLE_SKILL_MAPPING[inviteRole.toLowerCase()] || ROLE_SKILL_MAPPING.developer).map(sk => {
                    const isChecked = inviteSkills.some(s => s.toLowerCase() === sk.toLowerCase());
                    return (
                      <button
                        key={sk}
                        type="button"
                        onClick={() => toggleInviteSkill(sk)}
                        className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                          isChecked 
                            ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/20' 
                            : 'bg-white dark:bg-[#111] text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-white/10 hover:border-blue-400'
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3" />}
                        <span>{sk}</span>
                      </button>
                    );
                  })}

                  {/* Display Custom Skills */}
                  {inviteSkills.filter(s => !(ROLE_SKILL_MAPPING[inviteRole.toLowerCase()] || ROLE_SKILL_MAPPING.developer).some(sugg => sugg.toLowerCase() === s.toLowerCase())).map((skillName) => (
                    <div
                      key={skillName}
                      className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-purple-600 text-white shadow-sm shadow-purple-600/20 flex items-center gap-1.5"
                    >
                      <span className="bg-purple-800/60 px-1 py-0.2 text-[9px] rounded uppercase tracking-wider font-mono">Custom</span>
                      <span>{skillName}</span>
                      <button
                        type="button"
                        onClick={() => removeInviteCustomSkill(skillName)}
                        className="p-0.5 hover:bg-purple-700 rounded-full transition-colors ml-0.5"
                        title="Remove custom skill"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-gray-200/40 dark:border-white/5 flex gap-2">
                  <input
                    type="text"
                    placeholder="Add custom skill (e.g. Kubernetes, GraphQL)..."
                    value={inviteCustomSkill}
                    onChange={(e) => setInviteCustomSkill(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleInviteAddCustomSkill(e);
                      }
                    }}
                    className="flex-1 px-3 py-1.5 bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-xl text-xs outline-none focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={handleInviteAddCustomSkill}
                    className="px-3 py-1.5 bg-gray-200 dark:bg-white/10 text-gray-800 dark:text-gray-200 font-semibold rounded-xl text-xs flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase" htmlFor="invite-message-input">
                  Personal Message (Optional)
                </label>
                <textarea
                  id="invite-message-input"
                  rows={2}
                  placeholder="e.g. Excited to have you join our team sprint! Let's build something awesome."
                  value={inviteMessage}
                  onChange={(e) => setInviteMessage(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-white/10 rounded-xl text-sm outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <div className="flex gap-3 justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl text-sm font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !addProjectId || !inviteEmail.trim()}
                  className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-sm font-semibold transition-all shadow-sm shadow-blue-600/10"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending Invitation...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Invitation Email</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </Modal>

      {/* EDIT ROLE & SKILLS MODAL */}
      <Modal
        isOpen={isEditRoleModalOpen}
        onClose={() => { setIsEditRoleModalOpen(false); setEditingMember(null); setFormError(null); }}
        title="Edit Team Role & Skills"
      >
        {editingMember && (
          <form onSubmit={handleEditRoleSubmit} className="space-y-4 max-h-[80vh] overflow-y-auto pr-1">
            {formError && (
              <div className="p-3 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-xs rounded-xl border border-red-200 dark:border-red-900/50 leading-snug">
                {formError}
              </div>
            )}

            <div className="p-3 bg-gray-50 dark:bg-white/[0.02] rounded-xl border border-gray-200/50 dark:border-white/5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                {getDisplayName(editingMember).substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white">{getDisplayName(editingMember)}</h4>
                <p className="text-xs text-gray-500">@{editingMember.username} • {toTitleCase(editingMember.projectName)}</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase" htmlFor="edit-role-select">
                Team Role *
              </label>
              <select
                id="edit-role-select"
                value={editRole}
                onChange={(e) => {
                  const newR = e.target.value;
                  setEditRole(newR);
                  const defs = ROLE_SKILL_MAPPING[newR.toLowerCase()] || ROLE_SKILL_MAPPING.developer;
                  setEditSkills(defs);
                }}
                className="w-full px-3 py-2 bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:border-blue-500 outline-none transition-colors capitalize"
              >
                <option value="fullstack">Full Stack Developer</option>
                <option value="frontend">Frontend Developer</option>
                <option value="backend">Backend Developer</option>
                <option value="ml">Machine Learning Engineer</option>
                <option value="tester">Tester</option>
                <option value="designer">Designer</option>
              </select>
            </div>

            {/* Editable Skills Chips */}
            <div className="p-3.5 bg-gray-50 dark:bg-white/[0.02] rounded-2xl border border-gray-200/60 dark:border-white/5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-800 dark:text-gray-200">Role Skills & Competencies</span>
                <span className="text-[11px] text-gray-400">{editSkills.length} active</span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {(ROLE_SKILL_MAPPING[editRole.toLowerCase()] || ROLE_SKILL_MAPPING.developer).map((sk) => {
                  const isChecked = editSkills.some(s => s.toLowerCase() === sk.toLowerCase());
                  return (
                    <button
                      key={sk}
                      type="button"
                      onClick={() => toggleEditSkill(sk)}
                      className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                        isChecked 
                          ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/20' 
                          : 'bg-white dark:bg-[#111] text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-white/10 hover:border-blue-400'
                      }`}
                    >
                      {isChecked && <Check className="w-3 h-3" />}
                      <span>{sk}</span>
                    </button>
                  );
                })}

                {/* Display Custom Skills */}
                {editSkills.filter(s => !(ROLE_SKILL_MAPPING[editRole.toLowerCase()] || ROLE_SKILL_MAPPING.developer).some(sugg => sugg.toLowerCase() === s.toLowerCase())).map((skillName) => (
                  <div
                    key={skillName}
                    className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-purple-600 text-white shadow-sm shadow-purple-600/20 flex items-center gap-1.5"
                  >
                    <span className="bg-purple-800/60 px-1 py-0.2 text-[9px] rounded uppercase tracking-wider font-mono">Custom</span>
                    <span>{skillName}</span>
                    <button
                      type="button"
                      onClick={() => removeEditCustomSkill(skillName)}
                      className="p-0.5 hover:bg-purple-700 rounded-full transition-colors ml-0.5"
                      title="Remove custom skill"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add Edit Custom Skill */}
              <div className="pt-2 border-t border-gray-200/40 dark:border-white/5 flex gap-2">
                <input
                  type="text"
                  placeholder="Add custom skill (e.g. Kubernetes, GraphQL)..."
                  value={editCustomSkillInput}
                  onChange={(e) => setEditCustomSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleEditAddCustomSkill(e);
                    }
                  }}
                  className="flex-1 px-3 py-1.5 bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-xl text-xs outline-none focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={handleEditAddCustomSkill}
                  className="px-3 py-1.5 bg-gray-200 dark:bg-white/10 text-gray-800 dark:text-gray-200 font-semibold rounded-xl text-xs flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-3">
              <button
                type="button"
                onClick={() => setIsEditRoleModalOpen(false)}
                className="px-4 py-2 border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl text-sm font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-sm font-semibold transition-all shadow-sm shadow-blue-600/10"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>Save Role & Skills</span>
                )}
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* VIEW PROFILE MODAL / DRAWER */}
      <Modal
        isOpen={isProfileModalOpen}
        onClose={() => { setIsProfileModalOpen(false); setProfileMember(null); }}
        title="Member Profile Details"
      >
        {profileMember && (
          <div className="space-y-5">
            {/* Header Profile Banner */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-100 dark:border-blue-900/30">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/20">
                {getDisplayName(profileMember).substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{getDisplayName(profileMember)}</h3>
                <span className="text-xs font-mono text-gray-500 dark:text-gray-400">@{profileMember.username}</span>
                <div className="mt-1">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-600 text-white capitalize">
                    {profileMember.role || 'Member'}
                  </span>
                </div>
              </div>
            </div>

            {/* Profile Statistics Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-gray-50 dark:bg-white/[0.02] rounded-xl border border-gray-200/50 dark:border-white/5">
                <span className="text-gray-400 font-medium block">Project Team</span>
                <span className="font-bold text-gray-800 dark:text-gray-200 mt-1 block truncate">{toTitleCase(profileMember.projectName)}</span>
              </div>

              <div className="p-3 bg-gray-50 dark:bg-white/[0.02] rounded-xl border border-gray-200/50 dark:border-white/5">
                <span className="text-gray-400 font-medium block">Email Address</span>
                <span className="font-bold text-gray-800 dark:text-gray-200 mt-1 block truncate">{profileMember.user_email}</span>
              </div>

              <div className="p-3 bg-gray-50 dark:bg-white/[0.02] rounded-xl border border-gray-200/50 dark:border-white/5">
                <span className="text-gray-400 font-medium block">Weekly Availability</span>
                <span className="font-bold text-green-600 dark:text-green-400 mt-1 block">{profileMember.availability_hours || 40} hrs / week</span>
              </div>

              <div className="p-3 bg-gray-50 dark:bg-white/[0.02] rounded-xl border border-gray-200/50 dark:border-white/5">
                <span className="text-gray-400 font-medium block">Experience</span>
                <span className="font-bold text-amber-600 dark:text-amber-400 mt-1 block">{profileMember.experience || 1} years</span>
              </div>
            </div>

            {/* Skills & Competencies List */}
            <div>
              <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-2 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-blue-500" /> Skills & Technical Competencies
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {(Array.isArray(profileMember.skills) ? profileMember.skills : []).map((sk, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-900/30">
                    {sk}
                  </span>
                ))}
              </div>
            </div>

            {/* Assigned Tasks Summary */}
            <div className="pt-2">
              <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">Assigned Tasks ({profileMember.assignedTasksCount})</h4>
              <div className="max-h-40 overflow-y-auto space-y-2 pr-1">
                {allTasks.filter(t => t.assigned_to === profileMember.user || t.assigned_to_name === profileMember.username).length > 0 ? (
                  allTasks.filter(t => t.assigned_to === profileMember.user || t.assigned_to_name === profileMember.username).map(task => (
                    <div key={task.id} className="p-2.5 bg-gray-50 dark:bg-white/[0.02] rounded-xl border border-gray-100 dark:border-white/5 flex items-center justify-between text-xs">
                      <span className="font-semibold text-gray-800 dark:text-gray-200 truncate max-w-[200px]">{task.title}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                        {task.completion_percentage || 0}%
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-400 italic">No tasks currently assigned to this member.</p>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setIsProfileModalOpen(false)}
                className="px-4 py-2 bg-gray-200 dark:bg-white/10 hover:bg-gray-300 dark:hover:bg-white/20 text-gray-800 dark:text-gray-200 rounded-xl text-sm font-semibold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Teams;
