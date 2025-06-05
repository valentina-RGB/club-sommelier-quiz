class AdminResponseDto {
    constructor(admin) {
        this.id = admin.id;
        this.name = admin.name;
        this.email = admin.email;
    }
}

class ListAdminResponseDto {
    constructor(admins) {
        this.admins = admins.map(admin => new AdminResponseDto(admin));
    }
}

module.exports = { AdminResponseDto, ListAdminResponseDto };