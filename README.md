# Purpose
This project acts as a Filecoin Data DAO to encourage the storage of in demand public data as determined proportionally by donors. This can be thought of as a sort of decentralized patronage system whereby donors are given voting tokens which can incentivize "patrons" to actually pay for the hosting of data. This incentive lies in the form of the donations themselves, which are split among the patrons using ERC-4626. 

In short: Patrons act as shareholders of the DAO, and donors get the voting rights to direct patrons to pay for the hosting of data they find valuable

# Structure
The project consists of the following parts:
- Deal Client
- DAO
- Vote

## Deal Client
A contract provided by the Filecoin tutorial as a way to submit DealRequests

## DAO
The meat and potatoes. The DAO contract contains ERC-4626 logic, as well as hosts DealRequest proposals and their vote information

## Vote
An ERC-20 token mintable and burnable by the DAO