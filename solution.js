/**
 * class Node
 **/
class Node{
    constructor(){
        this.distance = -1
        this.neighbor = []
        this.explored = false
        this.parent = null
    }

    getDistance(){
        return this.distance
    }

    setDistance(distance){
        this.distance = distance
    }

    getExplored(){
        return this.explored
    }

    setExplored(boole){
        this.explored = boole
    }

    setParent(parent){
        this.parent = parent
    }

    getParent(){
        return this.parent
    }

    getNeighbors(){
        return this.neighbor
    }

    reset(){
        this.distance = -1
        this.explored = false
        this.parent = null
    }

    append_neighbor(neighbor){
        this.neighbor.push(neighbor)
    }

    remove_neighbor(neighbor){
        this.neighbor.filter((n)=>{
            if(n != neighbor){
                return n
            }
        })
    }
}

/*
* Search for the nearest gateway from skynet
*/
let nearest_gateway = (list_nodes, list_gateways) =>{
    let gateway = list_gateways[0]
    list_gateways.forEach((g) =>{
        if(list_nodes[gateway].getDistance() > list_nodes[g].getDistance()){
            gateway = g
        }
    })
    return gateway
}

/*
* Cut the link above skynet on the shorter way
*/ 
let link_to_cut = (list_nodes, gateway) => {
    let node1 = gateway
    let nodeP 
    while(list_nodes[node1].getParent() != null){
        nodeP = node1
        node1 = list_nodes[node1].getParent()
    }
    console.log(nodeP + ' ' + node1)
    list_nodes[nodeP].remove_neighbor(node1)
    list_nodes[node1].remove_neighbor(nodeP)
}

/*
* Map the shortest distance of node from Skynet 
*/
let parcours_en_largeur = (list_nodes, Skynet) => {

    list_nodes[Skynet].setExplored(true)
    list_nodes[Skynet].setDistance(0)

    var pile = []
    pile.push(Skynet)
    while(pile.length > 0){
        let current_node = list_nodes[pile[0]]
        current_node.getNeighbors().forEach((neighbor)=>{
            if(!list_nodes[neighbor].getExplored()){
                pile.push(neighbor)
                list_nodes[neighbor].setExplored(true)
                list_nodes[neighbor].setDistance(current_node.getDistance() + 1)
                list_nodes[neighbor].setParent(pile[0])
            }
        })
        pile.shift()
    }
    //console.error(list_nodes)
}

// Initialize lists and input
var inputs = readline().split(' ');
var list_nodes = []
var list_gateways = []

const N = parseInt(inputs[0]); // the total number of nodes in the level, including the gateways
for (let i = 0; i < N; i++){
    // Attach the node to its specific index 
    list_nodes[i] = new Node()
}

const L = parseInt(inputs[1]); // the number of links
const E = parseInt(inputs[2]); // the number of exit gateways


for (let i = 0; i < L; i++) {
    var inputs = readline().split(' ');
    const N1 = parseInt(inputs[0]); // N1 and N2 defines a link between these nodes
    const N2 = parseInt(inputs[1]);

    // Add neighbors of node
    list_nodes[N1].append_neighbor(N2)
    list_nodes[N2].append_neighbor(N1)
}

for (let i = 0; i < E; i++) {
    const EI = parseInt(readline()); // the index of a gateway node
    // Add gateway to the list
    list_gateways.push(EI)
}

// game loop
while (true) {
    const SI = parseInt(readline()); // The index of the node on which the Skynet agent is positioned this turn
    //console.error(list_nodes)

    // Map all node
    parcours_en_largeur(list_nodes, SI)

    // Get the nearest gateway
    let n_gateway = nearest_gateway(list_nodes,list_gateways)

    // Cut link and delete link 
    link_to_cut(list_nodes,n_gateway)

    // Reset node for the next round
    list_nodes.forEach((node)=> {
        node.reset()
    })
}
