import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogOut, Plus, TreePine, Users } from "lucide-react";

export default function Dashboard() {
  const [trees, setTrees] = useState([]);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const fetchTrees = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/trees");
      setTrees(data);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/");
      } else {
        setError(err.response?.data?.message || "Failed to load trees");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrees();
  }, []);

  const handleCreateTree = async (e) => {
    e.preventDefault();
    setError("");
    if (!name.trim()) return;

    try {
      const { data } = await API.post("/trees", { name: name.trim() });
      setTrees((prev) => [data, ...prev]);
      setName("");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to create tree");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-indigo-600 rounded-xl shadow-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-lg font-bold text-slate-800">FamilyConnect</h1>
          </div>
          <Button
            size="sm"
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white flex items-center space-x-1"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </Button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        <h1 className="text-lg font-bold text-slate-700 mb-6">
          Welcome to the Family Tree Dashboard
        </h1>

        {/* Create New Tree Card */}
        <Card className="shadow-lg border-0 bg-white">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-slate-800">
              <Plus className="h-5 w-5 text-indigo-600" />
              <span>Create a New Tree</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateTree} className="flex items-end gap-3">
              <div className="flex-1 space-y-2">
                <Label
                  htmlFor="treeName"
                  className="text-sm font-medium text-slate-700"
                >
                  Family Tree Name
                </Label>
                <Input
                  id="treeName"
                  type="text"
                  placeholder="e.g., Gujjar Family Tree"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <Button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6"
              >
                Create
              </Button>
            </form>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </CardContent>
        </Card>

        {/* Your Family Trees Card */}
        <Card
          className="shadow-lg border-0 bg-white mt-8"
          // change color here (card background)
        >
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <Users className="h-5 w-5 text-indigo-600" />
              <span>Your Family Trees</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-center text-indigo-600">
                Fetching your trees...
              </p>
            ) : trees.length === 0 ? (
              <p className="text-gray-600 text-center">
                No trees yet. Create your first one!
              </p>
            ) : (
              <div className="space-y-3">
                {trees.map((tree) => (
                  <div
                    key={tree.id}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border hover:bg-slate-100 transition"
                    // change color here (tree row background)
                  >
                    <span className="font-medium text-slate-800">
                      {tree.name}
                    </span>
                    <Button
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-6"
                      onClick={() => navigate(`/family-tree/${tree.id}`)}
                    >
                      Open
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
