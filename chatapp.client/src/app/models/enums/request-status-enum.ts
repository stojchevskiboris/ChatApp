export enum RequestStatusEnum {
    Pending = 1, // initial status

    Canceled = 2, // sender cancels the request

    Accepted = 3, // receiver accepts the request

    Rejected = 4 // receiver rejects the request
}