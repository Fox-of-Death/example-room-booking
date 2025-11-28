const prisma = require('../prisma');

// GET /rooms
exports.getRooms = async (req, res) => {
  try {
    // 
    const rooms = await prisma.room.findMany();

    res.json({
      status: 'success',
      message: 'Rooms retrieved successfully',
      data: rooms,
    });
  } catch (error) {
    console.error('Error fetching rooms:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: { detail: 'Unable to fetch rooms' },
    });
  }
};

// GET /rooms/:id
exports.getRoomById = async (req, res) => {
  const roomId = parseInt(req.params.id, 10);

  if (isNaN(roomId)) {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid room id',
    });
  }

  try {
    const room = await prisma.room.findUnique({
      where: { id: roomId },
    });

    if (!room) {
      return res.status(404).json({
        status: 'error',
        message: 'Room not found',
      });
    }

    res.json({
      status: 'success',
      message: 'Room retrieved successfully',
      data: room,
    });
  } catch (error) {
    console.error('Error fetching room:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: { detail: 'Unable to fetch room' },
    });
  }
};

// POST /rooms
exports.createRoom = async (req, res) => {
  const { name, building, capacity } = req.body;

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
    const newRoom = await prisma.room.create({
      data: {
        name,
        building: building || null,
        capacity,
      },
    });

    // created
    res.status(201).json({
      status: 'success',
      message: 'Room created successfully',
      data: newRoom,
    });
  } catch (error) {
    console.error('Error creating room:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: { detail: 'Unable to create room' },
    });
  }
};

// PUT /rooms/:id
exports.updateRoom = async (req, res) => {
  const roomId = parseInt(req.params.id, 10);
  const { name, building, capacity, isActive } = req.body;

  if (isNaN(roomId)) {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid room id',
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
    const updatedRoom = await prisma.room.update({
      where: { id: roomId },
      data: {
        name,
        building: building ?? null,
        capacity,
        isActive: typeof isActive === 'boolean' ? isActive : undefined,
      },
    });

    res.json({
      status: 'success',
      message: 'Room updated successfully',
      data: updatedRoom,
    });
  } catch (error) {
    console.error('Error updating room:', error);

    // Prisma error: record not found
    if (error.code === 'P2025') {
      return res.status(404).json({
        status: 'error',
        message: 'Room not found',
      });
    }

    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: { detail: 'Unable to update room' },
    });
  }
};
// DELETE /rooms/:id
exports.deleteRoom = async (req, res) => {
  const roomId = parseInt(req.params.id, 10);

  if (isNaN(roomId)) {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid room id',
    });
  }

  try {
    const deletedRoom = await prisma.room.delete({
      where: { id: roomId },
    });

    res.json({
      status: 'success',
      message: 'Room deleted successfully',
      data: deletedRoom,
    });
  } catch (error) {
    console.error('Error deleting room:', error);

    if (error.code === 'P2025') {
      return res.status(404).json({
        status: 'error',
        message: 'Room not found',
      });
    }

    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: { detail: 'Unable to delete room' },
    });
  }
};
