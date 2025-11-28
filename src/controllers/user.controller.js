const prisma = require('../prisma');

// GET /user
exports.getUsers = async (req, res) => {
  try {
    // 
    const users = await prisma.user.findMany();

    res.json({
      status: 'success',
      message: 'Users retrieved successfully',
      data: users,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: { detail: 'Unable to fetch users' },
    });
  }
};

// GET /user/:id
exports.getUserById = async (req, res) => {
  const userId = parseInt(req.params.id, 10);

  if (isNaN(userId)) {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid user id',
    });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
    }

    res.json({
      status: 'success',
      message: 'User retrieved successfully',
      data: user,
    });
  } catch (error) {
    console.error('Error fetching User:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: { detail: 'Unable to fetch user' },
    });
  }
};

// POST /user
exports.createUser = async (req, res) => {
  const { name, email, password, tel } = req.body;

  if (!name) {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid request body',
      error: {
        detail: 'name is required',
      },
    });
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'Email already exists',
      })
    }

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password,
        tell: tell || tel,
        role: 'user', 
      },
    });

    // created
    res.status(201).json({
      status: 'success',
      message: 'User created successfully',
      data: newUser,
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: { detail: 'Unable to create user' },
    });
  }
};

// PUT /user/:id
exports.updateUser = async (req, res) => {
  const userId = Number(req.params.id);
  const { name, building, capacity, isActive } = req.body;
  
  if (isNaN(userId)) {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid user id',
    });
  }

  if (!name || typeof capacity !== 'number') {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid request body',
      error: {
        detail: 'name is required and capacity must be a number',
      },
    });
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        email,
        password,
        tel: tel ?? null,
        role ,
      },
    });

    res.json({
      status: 'success',
      message: 'User updated successfully',
      data: updatedUser,
    });
  } catch (error) {
    console.error('Error updating user:', error);

    // Prisma error: record not found
    if (error.code === 'P2025') {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
    }

    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: { detail: 'Unable to update user' },
    });
  }
};

// DELETE /user/:id
exports.deleteUser = async (req, res) => {
  const userId = parseInt(req.params.id, 10);

  if (isNaN(userId)) {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid user id',
    });
  }

  try {
    const deletedUser = await prisma.user.delete({
      where: { id: userId },
    });

    res.json({
      status: 'success',
      message: 'User deleted successfully',
      data: deletedUser,
    });
  } catch (error) {
    console.error('Error deleting user:', error);

    if (error.code === 'P2025') {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found',
      });
    }

    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: { detail: 'Unable to delete user' },
    });
  }
};