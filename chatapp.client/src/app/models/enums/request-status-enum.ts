export enum RequestStatusEnum {
    Pending = 1, // initial status

    Canceled = 2, // sender cancels the request

    Accepted = 3, // reciever accepts the request

    Rejected = 4 // reciever rejects the request
}